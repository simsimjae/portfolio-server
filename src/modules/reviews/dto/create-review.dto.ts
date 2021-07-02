import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  contents: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  portfolioId: number;
}

export default CreateReviewDto;
