import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '유효하지 않은 이메일입니다.' })
  @IsNotEmpty({ message: '이메일이 없습니다.' })
  readonly email: string;

  @IsNotEmpty({ message: '비밀번호가 없습니다.' })
  readonly password: string;
}
