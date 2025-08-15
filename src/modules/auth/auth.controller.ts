import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { RefreshDto } from './dto/refresh.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseFilters(new HttpExceptionFilter())
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    const ip = request.ip; // Gets the client IP address
    const userAgent = request.headers['user-agent']; // Gets the User-Agent header
    // console.log(ip, userAgent);
    try {
      // const res = await this.authService.login(loginDto, ip, userAgent);
      // await this.auditLogService.createAuditLog(res.userId, 'login', res);

      return { hello: 'world' };
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refreshToken(refreshDto.token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request) {
    const userId = request['user'].userId;
    const sessionId = request['user'].sessionId;
    return await this.authService.logout(userId, sessionId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    const userId = request['user'].userId;
    return await this.authService.me(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = request['user'].userId;
    return await this.authService.changePassword(userId, changePasswordDto);
  }
}
