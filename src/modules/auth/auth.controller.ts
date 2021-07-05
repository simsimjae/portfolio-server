import { LoginDto } from './dto/login.dto';
import { Controller, UseGuards, Get, Res, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { User } from '../../common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  async join(@Body() dto: CreateUserDto) {
    const user = await this.authService.createUserByEmail(dto);
    return await this.authService.createTokens(user.id);
  }

  @Get('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.loginByEmail(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getUserMe(@User() user) {
    const { password, isActive, snsId, deletedAt, ...rest } = user;
    return rest;
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@User() user, @Res({ passthrough: true }) res: Response) {
    const { accessToken, ...accessCookieOption } = await this.authService.getCookieWithJwtAccessToken(user.id);
    const { refreshToken, ...refreshCookieOption } = await this.authService.getCookieWithJwtRefreshToken(user.id);
    res.cookie('ACCESS_TOKEN', accessToken, accessCookieOption);
    res.cookie('REFRESH_TOKEN', refreshToken, refreshCookieOption);
  }

  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverLogin() {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverLoginCallback(@User() user, @Res({ passthrough: true }) res: Response) {
    const { accessToken, ...accessCookieOption } = await this.authService.getCookieWithJwtAccessToken(user.id);
    const { refreshToken, ...refreshCookieOption } = await this.authService.getCookieWithJwtRefreshToken(user.id);
    res.cookie('ACCESS_TOKEN', accessToken, accessCookieOption);
    res.cookie('REFRESH_TOKEN', refreshToken, refreshCookieOption);
  }
}
