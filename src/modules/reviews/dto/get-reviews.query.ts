import { IsOptional } from 'class-validator';

class GetReviewsQuery {
  @IsOptional()
  portfolioId: string;
}

export default GetReviewsQuery;
