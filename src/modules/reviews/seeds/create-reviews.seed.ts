import { Seeder, Factory } from 'typeorm-seeding';
import { Review } from '../entities/review.entity';

export default class CreatePortfolios implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Review)().createMany(10);
  }
}
