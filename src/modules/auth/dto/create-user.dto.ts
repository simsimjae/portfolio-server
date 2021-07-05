import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '이름이 없습니다.' })
  readonly name: string;

  @IsEmail({}, { message: '유효하지 않은 이메일입니다.' })
  @IsNotEmpty({ message: '이메일이 없습니다.' })
  readonly email: string;

  @IsNotEmpty({ message: '비밀번호가 없습니다.' })
  readonly password: string;

  @IsOptional()
  readonly thumbnail: string;
}
