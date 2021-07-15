import { IsNotEmpty } from 'class-validator';

export class PagingDto {
  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  offset: number;
}
