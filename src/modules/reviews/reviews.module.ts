import { Portfolio } from './../portfolios/entities/portfolio.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Portfolio])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
