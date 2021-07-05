import { Seeder, Factory } from 'typeorm-seeding';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioImage } from '../entities/portfolioImage.entity';

export default class CreatePortfolios implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const portfolioFactory = factory(Portfolio)();
    portfolioFactory
      .map(async (portfolio) => {
        const bannerImage = await factory(PortfolioImage)({ type: 'banner' }).create();
        const thumbnailImage = await factory(PortfolioImage)({ type: 'thumbnail' }).create();
        portfolio.images = [bannerImage, thumbnailImage];
        return portfolio;
      })
      .createMany(3);
  }
}
