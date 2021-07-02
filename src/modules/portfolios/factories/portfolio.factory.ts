import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Portfolio } from '../entities/portfolio.entity';
import dayjs from 'dayjs';

define(Portfolio, (faker: typeof Faker) => {
  const portfolio = new Portfolio({
    id: faker.random.number(10000),
    contents: faker.lorem.lines(20) + `<img src="${faker.image.imageUrl(1200, 1200)}" />` + faker.lorem.lines(10),
    link: faker.internet.url(),
    mainTask: faker.company.catchPhrase(),
    participants: faker.name.jobTitle(),
    period: `${dayjs(faker.date.recent(24)).format('YYYY-MM-DD')} ~ ${dayjs(faker.date.recent(14)).format('YYYY-MM-DD')}`,
    role: faker.name.jobDescriptor(),
    title: faker.company.catchPhraseDescriptor(),
    techStacks: '리액트, 장고',
    type: '웹사이트',
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  });
  return portfolio;
});
