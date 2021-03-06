import { User } from './../../users/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from '../entities/token.entity';
import { ConfigService } from '../../../modules/config/config.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_APPKEY'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    if (!profile) throw new UnauthorizedException();
    const user = await this.usersRepository.findOne({ where: { provider: 'kakao', snsId: profile._json.id } });
    if (!user) {
      const { id, properties, kakao_account } = profile._json;
      const { nickname, profile_image, thumbnail_image } = properties;
      const { email } = kakao_account;

      const newUser = new User();
      newUser.snsId = id;
      newUser.email = email;
      newUser.name = nickname;
      newUser.provider = 'kakao';
      newUser.thumbnail = thumbnail_image;

      // const
      // const token = new Token();

      return await this.usersRepository.save(newUser);
    }
    return user;
  }
}
