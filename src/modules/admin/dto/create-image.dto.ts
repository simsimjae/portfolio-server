import { IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsNotEmpty()
  bucketPath: string;

  @IsNotEmpty()
  image: any;
}
