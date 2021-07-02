import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../common/decorators/user.decorator';
import CreateReviewDto from './dto/create-review.dto';
import GetReviewsQuery from './dto/get-reviews.query';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findAll(@Query() query: GetReviewsQuery) {
    return this.reviewsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createOne(@User() user, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createOne(dto, user);
  }
}
