import * as Faker from 'faker';
import { define, factory } from 'typeorm-seeding';
import { User } from '../../users/entities/user.entity';

define(User, (faker: typeof Faker, context: Partial<User>) => {
  const user = new User({
    id: faker.random.uuid(),
    age: Math.round(Math.random() * 40).toString(),
    birthday: faker.date.past(20),
    name: faker.name.firstName() + faker.name.lastName(),
    thumbnail: `https://picsum.photos/${Math.round(Math.random() * 40 + 40)}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    ...context,
  });
  return user;
});
