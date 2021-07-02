import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { UsersService } from '../users/users.service';
import { UserModule } from '../users/users.module';
import { Token } from './entities/token.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { NaverStrategy } from './strategies/naver.strategy';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Token]), PassportModule.register({ defaultStrategy: 'jwt', session: false })],
  controllers: [AuthController],
  providers: [AuthService, UsersService, KakaoStrategy, NaverStrategy, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
