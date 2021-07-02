import { IsNotEmpty, IsOptional } from 'class-validator';

class CreatePortfolioDto {
  @IsNotEmpty()
  link: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  contents: string;

  @IsNotEmpty({ message: '기술스택이 비어있습니다.' })
  techStacks: string;

  @IsNotEmpty()
  participants: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  period: string;

  @IsNotEmpty()
  mainTask: string;

  @IsOptional()
  rank?: number;

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  banner: string;

  @IsNotEmpty()
  imageUrls: string[];
}

export default CreatePortfolioDto;
