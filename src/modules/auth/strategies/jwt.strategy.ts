import { UsersService } from '../../users/users.service';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import CONSTANT from '../../../config/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req) => {
        return req.cookies ? req.cookies['ACCESS_TOKEN'] : null;
      },
      passReqToCallback: false,
      secretOrKey: CONSTANT.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload) {
    const user = await this.usersService.findOne(payload.id);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

export const callback = (err, user, info) => {
  let message;
  if (err) {
    return err || new UnauthorizedException(info.message);
  } else if (typeof info != 'undefined' || !user) {
    switch (info.message) {
      case 'No auth token':
        message = '토큰이 없습니다.';
        break;
      case 'jwt malformed':
        message = '조작된 토큰입니다.';
        break;
      case 'invalid token':
        message = '유효하지 않은 토큰입니다.';
        break;
      case 'invalid signature':
        message = 'You must provide a valid authenticated access token';
        break;
      case 'jwt expired':
        message = '토큰이 만료되었습니다.';
        break;
      default:
        message = info.message;
        break;
    }
    throw new UnauthorizedException(message);
  }
  return user;
};
