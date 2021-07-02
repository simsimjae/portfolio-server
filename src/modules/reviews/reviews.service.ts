import { Portfolio } from './../portfolios/entities/portfolio.entity';
import { User } from './../users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import CreateReviewDto from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private readonly reviewsRepository: Repository<Review>, @InjectRepository(Portfolio) private readonly portfoliosRepository: Repository<Portfolio>) {}

  async findAll(query) {
    if (query.portfolioId) {
      return await this.reviewsRepository.find({ where: { portfolio: query.portfolioId } });
    }
    return this.reviewsRepository.find();
  }

  async findOne(id) {
    return this.reviewsRepository.findOne(id);
  }

  async createOne(dto: CreateReviewDto, user: User) {
    const portfolio = await this.portfoliosRepository.findOne(dto.portfolioId);
    if (!portfolio) throw new NotFoundException('portfolio is not found');
    const review = new Review();
    review.contents = dto.contents;
    review.rating = dto.rating;
    review.portfolio = portfolio;
    review.writer = user;
    return await this.reviewsRepository.save(review);
  }
}
