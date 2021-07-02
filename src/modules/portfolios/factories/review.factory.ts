import * as Faker from 'faker';
import { Review } from '../../reviews/entities/review.entity';
import { define } from 'typeorm-seeding';

interface Context {
  portfolioId: number;
  writerId: number;
}

define(Review, (faker: typeof Faker, { portfolioId, writerId }: Context) => {
  const portfolio = new Review({
    id: faker.random.number(10000),
    contents: faker.lorem.lines(Math.round(Math.random() * 2 + 3)),
    rating: Math.round(Math.random() * 5),
    portfolio: portfolioId as any,
    writer: writerId as any,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
  return portfolio;
});
