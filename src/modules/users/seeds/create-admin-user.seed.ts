import { Seeder, Factory } from 'typeorm-seeding';
import { User } from '../entities/user.entity';

export default class CreateAdminUser implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().create({
      role: 'admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: '관리자',
      provider: 'email',
    });
  }
}
