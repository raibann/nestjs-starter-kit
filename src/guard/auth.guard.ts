import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly appConfigService: AppConfigService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.appConfigService.getConfig().jwt.secret,
      }) as { userId: string; sessionId: string };
      request['user'] = decoded;

      const session = await this.prisma.session.findFirst({
        where: {
          userId: decoded.userId,
          id: decoded.sessionId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!session) {
        throw new UnauthorizedException();
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
