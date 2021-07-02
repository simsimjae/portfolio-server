import { Token } from './entities/token.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import ms from 'ms';
import CONSTANT from '../../config/constant';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>, @InjectRepository(Token) private readonly tokensRepository: Repository<Token>) {}

  createAccessToken(payload) {
    return sign(payload, CONSTANT.JWT_ACCESS_SECRET, { expiresIn: CONSTANT.JWT_ACCESS_EXPIRATION });
  }

  createRefreshToken(payload) {
    return sign(payload, CONSTANT.JWT_REFRESH_SECRET, { expiresIn: CONSTANT.JWT_REFRESH_EXPIRATION });
  }

  createTokens(id: number | string) {
    return { accessToken: this.createAccessToken({ id }), refreshToken: this.createRefreshToken({ id }) };
  }

  getCookieWithJwtAccessToken(id: number | string) {
    return {
      accessToken: this.createAccessToken({ id }),
      domain: CONSTANT.DOMAIN,
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: ms(CONSTANT.JWT_ACCESS_EXPIRATION),
    } as const;
  }

  getCookieWithJwtRefreshToken(id: number | string) {
    return {
      refreshToken: this.createRefreshToken({ id }),
      domain: CONSTANT.DOMAIN,
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: ms(CONSTANT.JWT_REFRESH_EXPIRATION),
    } as const;
  }

  async getAccessTokenFromRefreshToken(refreshToken: string) {
    const token = await this.tokensRepository.findOne({ refresh: refreshToken });
    if (!token) throw new NotFoundException('refresh token is not found');
    if (token.expiresAt < new Date()) throw new UnauthorizedException('refresh token is expired');
    const { id } = verify(refreshToken, CONSTANT.JWT_REFRESH_SECRET) as any;
    return this.createAccessToken({ id });
  }

  async removeRefreshToken(tokenId: string) {
    await this.tokensRepository.delete(tokenId);
  }
}
