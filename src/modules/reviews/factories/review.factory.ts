import { Portfolio } from '../../portfolios/entities/portfolio.entity';
import { User } from '../../users/entities/user.entity';
import * as Faker from 'faker';
import { Review } from '../entities/review.entity';
import { define, factory } from 'typeorm-seeding';

define(Review, (faker: typeof Faker) => {
  const review = new Review({
    id: faker.random.number(10000),
    contents: faker.lorem.lines(Math.round(Math.random() * 2 + 3)),
    rating: Math.round(Math.random() * 5),
    portfolio: factory(Portfolio)() as any,
    writer: factory(User)() as any,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
  return review;
});
