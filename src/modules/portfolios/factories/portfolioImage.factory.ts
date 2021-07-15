import * as Faker from 'faker';
import { sample } from 'lodash';
import { define } from 'typeorm-seeding';
import { PortfolioImage } from '../entities/portfolioImage.entity';

interface Context {
  type?: 'banner' | 'thumbnail';
  bucket: string;
}

define(PortfolioImage, (faker: typeof Faker, { type, bucket }: Context) => {
  const portfolioImage = new PortfolioImage({
    bucket: bucket,
    key: `portfolios/images/${sample(['1626334923710', '1626335106076', '1626335137420'])}`,
    type: type || 'general',
  });
  return portfolioImage;
});
