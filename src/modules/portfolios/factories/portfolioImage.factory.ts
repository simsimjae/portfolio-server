import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { PortfolioImage } from '../entities/portfolioImage.entity';

interface Context {
  type?: 'banner' | 'thumbnail';
}

define(PortfolioImage, (faker: typeof Faker, { type }: Context) => {
  const portfolioImage = new PortfolioImage({
    bucket: `https://picsum.photos`,
    key: `${Math.round(Math.random() * 400 + 1080)}`,
    type: type || 'general',
  });
  return portfolioImage;
});
