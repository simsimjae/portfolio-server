import * as Faker from 'faker';
import { sample } from 'lodash';
import { define } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';

define(User, (faker: typeof Faker) => {
  const portfolio = new User({
    id: faker.random.uuid(),
    name: sample(['김영희', '안철수', '심재철', '홍길동']),
    thumbnail: `https://picsum.photos/${Math.round(Math.random() * 40 + 40)}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
  return portfolio;
});
