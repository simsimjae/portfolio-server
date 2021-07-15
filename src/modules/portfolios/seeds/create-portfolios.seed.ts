import { Seeder, Factory } from 'typeorm-seeding';
import { Portfolio } from '../entities/portfolio.entity';
import { PortfolioImage } from '../entities/portfolioImage.entity';

export default class CreatePortfolios implements Seeder {
  constructor() {}

  public async run(factory: Factory): Promise<void> {
    const portfolioFactory = await factory(Portfolio)();
    portfolioFactory
      .map(async (portfolio) => {
        const bannerImage = await factory(PortfolioImage)({ bucket: process.env.GCP_BUCKET_NAME, type: 'banner' }).create();
        const thumbnailImage = await factory(PortfolioImage)({ bucket: process.env.GCP_BUCKET_NAME, type: 'thumbnail' }).create();
        portfolio.images = [bannerImage, thumbnailImage];
        return portfolio;
      })
      .createMany(3);
  }
}
