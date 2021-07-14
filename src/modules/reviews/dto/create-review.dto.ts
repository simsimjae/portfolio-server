import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class CreateReviewDto {
  @IsNotEmpty()
  contents: string;

  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  portfolioId: number;
}

export default CreateReviewDto;
