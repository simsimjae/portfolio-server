import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';

define(User, (faker: typeof Faker) => {
  const portfolio = new User({
    id: faker.random.uuid(),
    name: '관리자',
    thumbnail: `https://picsum.photos/${Math.round(Math.random() * 40 + 40)}`,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    role: 'admin',
  });
  return portfolio;
});
