import { Seeder, Factory } from 'typeorm-seeding';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioImage } from '../entities/portfolioImage.entity';
import { flatten } from 'lodash';
import { Review } from '../../reviews/entities/review.entity';
import { User } from '../../users/entities/user.entity';

export default class CreatePortfolios implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const portfolios = await factory(Portfolio)().createMany(10);
    for (const portfolio of portfolios) {
      const banner = await factory(PortfolioImage)({ portfolioId: portfolio.id, type: 'banner' }).create();
      const thumbnail = await factory(PortfolioImage)({ portfolioId: portfolio.id, type: 'thumbnail' }).create();
      const generals = await factory(PortfolioImage)({ portfolioId: portfolio.id }).createMany(3);
      portfolio.images = flatten([generals, banner, thumbnail]);

      for (const user of await factory(User)().createMany(3)) {
        await factory(Review)({ portfolioId: portfolio.id, writerId: user.id }).create();
      }
    }
  }
}
