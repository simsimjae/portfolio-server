import { LoginDto } from './dto/login.dto';
import { Token } from './entities/token.entity';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import ms from 'ms';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, @InjectRepository(User) private readonly usersRepository: Repository<User>, @InjectRepository(Token) private readonly tokensRepository: Repository<Token>) {}

  async loginByEmail(dto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('가입되지 않은 회원입니다.');
    if (!compareSync(dto.password, user.password)) throw new UnauthorizedException('로그인 / 비밀번호를 확인해주세요.');
    return await this.createTokens(user.id);
  }

  async createUserByEmail(dto: CreateUserDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (user) throw new ConflictException('이미 가입된 유저입니다.');
    return await this.usersRepository.save(new User(dto));
  }

  createAccessToken(payload) {
    return sign(payload, this.configService.get('JWT_ACCESS_SECRET'), { expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION') });
  }

  createRefreshToken(payload) {
    return sign(payload, this.configService.get('JWT_REFRESH_SECRET'), { expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') });
  }

  createTokens(id: number | string) {
    return { accessToken: this.createAccessToken({ id }), refreshToken: this.createRefreshToken({ id }) };
  }

  getCookieWithJwtAccessToken(id: number | string) {
    return {
      accessToken: this.createAccessToken({ id }),
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('JWT_ACCESS_EXPIRATION')),
    } as const;
  }

  getCookieWithJwtRefreshToken(id: number | string) {
    return {
      refreshToken: this.createRefreshToken({ id }),
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('JWT_REFRESH_EXPIRATION')),
    } as const;
  }

  async getAccessTokenFromRefreshToken(refreshToken: string) {
    const token = await this.tokensRepository.findOne({ refresh: refreshToken });
    if (!token) throw new NotFoundException('refresh token is not found');
    if (token.expiresAt < new Date()) throw new UnauthorizedException('refresh token is expired');
    const { id } = verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET')) as any;
    return this.createAccessToken({ id });
  }

  async removeRefreshToken(tokenId: string) {
    await this.tokensRepository.delete(tokenId);
  }
}
