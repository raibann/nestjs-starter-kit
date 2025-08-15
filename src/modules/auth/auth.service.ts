import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { BcryptService } from 'src/common/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from 'src/config/config.service';
import { ENUM_USER_STATUS } from 'src/libs/enum';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async signToken(userId: string, sessionId: string) {
    const payload = {
      userId: userId,
      sessionId: sessionId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.appConfigService.getConfig().jwt.accessTokenExpiration,
      secret: this.appConfigService.getConfig().jwt.secret,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.appConfigService.getConfig().jwt.refreshTokenExpiration,
      secret: this.appConfigService.getConfig().jwt.secret,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto, ip: string, userAgent: string) {
    try {
      // check if user is active
      const user = await this.prisma.user.findUnique({
        where: { email: loginDto.email, status: ENUM_USER_STATUS.ACTIVE },
        select: {
          id: true,
          email: true,
          password: true,
          status: true,
        },
      });

      if (!user) {
        throw new BadRequestException('Incorrect username or password');
      }

      if (user.status === ENUM_USER_STATUS.INACTIVE) {
        throw new UnauthorizedException('User is inactive');
      }

      // check if password is valid
      const isPasswordValid = await this.bcryptService.compare(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }

      // create session
      const session = await this.prisma.session.create({
        data: {
          userId: user.id,
          ip: ip,
          userAgent: userAgent,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      if (!session) {
        throw new HttpException(
          'Failed dependency',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      // create access token and refresh token
      const { accessToken, refreshToken } = await this.signToken(
        user.id,
        session.id,
      );

      // create refresh token
      const refreshTokenEntity = await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(
            Date.now() +
              this.appConfigService.getConfig().jwt.refreshTokenExpiration,
          ),
        },
      });

      if (!refreshTokenEntity) {
        throw new HttpException(
          'Failed dependency',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      // create audit log
      await this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'login',
          data: {
            ip: ip,
            userAgent: userAgent,
            email: user.email,
            status: user.status,
          },
        },
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Incorrect username or password');
    }
  }

  async refreshToken(token: string) {
    try {
      const stored = await this.prisma.refreshToken.findUnique({
        where: { token: token },
        select: {
          userId: true,
          sessionId: true,
          revoked: true,
          expiresAt: true,
        },
      });

      if (!stored) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (stored.revoked || stored.expiresAt < new Date()) {
        // reuse of revoked token => compromise
        // Revoke all refresh tokens for the user or session
        await this.prisma.refreshToken.updateMany({
          where: { userId: stored.userId },
          data: { revoked: true },
        });
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken, refreshToken } = await this.signToken(
        stored.userId,
        stored.sessionId,
      );

      const refreshTokenEntity = await this.prisma.refreshToken.create({
        data: {
          userId: stored.userId,
          token: refreshToken,
          sessionId: stored.sessionId,
          expiresAt: new Date(
            Date.now() +
              this.appConfigService.getConfig().jwt.refreshTokenExpiration,
          ),
        },
      });

      if (!refreshTokenEntity) {
        throw new HttpException(
          'Failed dependency',
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, sessionId: string) {
    try {
      // check refresh token is valid
      await this.prisma.$transaction(async (tx) => {
        await tx.refreshToken.deleteMany({
          where: {
            userId: userId,
            sessionId: sessionId,
            revoked: false,
            expiresAt: { gt: new Date() },
          },
        });

        await tx.session.deleteMany({
          where: {
            userId: userId,
            id: sessionId,
          },
        });
      });

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Failed to logout');
    }
  }

  async me(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          isSuperAdmin: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return user;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('User not found');
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          password: true,
          email: true,
          status: true,
        },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await this.bcryptService.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Incorrect current password');
      }

      const newPassword = await this.bcryptService.hash(
        changePasswordDto.newPassword,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: { password: newPassword },
      });

      // create audit log
      await this.prisma.auditLog.create({
        data: {
          userId: userId,
          action: 'change_password',
          data: {
            email: user.email,
            status: user.status,
          },
        },
      });

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to change password');
    }
  }
}
