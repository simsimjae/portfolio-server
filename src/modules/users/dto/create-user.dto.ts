import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '이름이 없습니다.' })
  readonly name: string;

  @IsEmail({}, { message: '유효하지 않은 이메일입니다.' })
  @IsNotEmpty({ message: '이메일이 없습니다.' })
  readonly email: string;

  @IsString()
  @IsNotEmpty({ message: '썸네일이 없습니다.' })
  readonly thumbnail: string;
}
