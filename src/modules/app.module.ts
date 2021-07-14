import { Module } from '@nestjs/common';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from './reviews/reviews.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import AdminBro from 'admin-bro';
import { validate } from 'class-validator';
import { Resource, Database } from '@admin-bro/typeorm';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from './config/config.module';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

@Module({
  imports: [ConfigModule, TypeOrmModule.forRoot(), AdminModule, AuthModule, PortfoliosModule, UserModule, ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
