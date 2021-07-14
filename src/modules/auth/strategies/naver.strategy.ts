import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '../../../modules/config/config.service';

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID'),
      clientSecret: configService.get('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    if (!profile) throw new UnauthorizedException();
    let user = await this.usersRepository.findOne({ where: { provider: 'naver', snsId: profile.id } });
    if (!user) {
      user = new User();
      user.email = profile?._json?.email;
      user.name = profile?._json?.nickname;
      user.provider = 'naver';
      user.snsId = profile?.id;
      user.thumbnail = profile?._json?.profile_image;
      user.age = profile?._json?.age;
      user.birthday = profile?._json?.birthday;
      await this.usersRepository.save(user);
    }
    return user;
  }
}
