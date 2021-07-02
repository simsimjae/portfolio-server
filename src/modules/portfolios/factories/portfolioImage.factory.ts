import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { PortfolioImage } from '../entities/portfolioImage.entity';

interface Context {
  portfolioId: number;
  type?: 'banner' | 'thumbnail';
}

define(PortfolioImage, (faker: typeof Faker, context: Context) => {
  const { portfolioId, type } = context;
  const portfolioImage = new PortfolioImage({
    portfolio: portfolioId as any,
    url: `https://picsum.photos/${Math.round(Math.random() * 400 + 1080)}`,
    type: type || 'general',
  });
  return portfolioImage;
});
