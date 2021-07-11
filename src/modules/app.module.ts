import { Token } from './auth/entities/token.entity';
import { Review } from './reviews/entities/review.entity';
import { Portfolio } from './portfolios/entities/portfolio.entity';
import { Module } from '@nestjs/common';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from './reviews/reviews.module';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from '@admin-bro/nestjs';
import { User } from './users/entities/user.entity';
import AdminBro from 'admin-bro';
import { validate } from 'class-validator';
import { compareSync } from 'bcrypt';
import { Resource, Database } from '@admin-bro/typeorm';
import uploadFeature from '@admin-bro/upload';
import { PortfolioImage } from './portfolios/entities/portfolioImage.entity';

Resource.validate = validate;
AdminBro.registerAdapter({ Database, Resource });

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AdminModule.createAdmin({
      adminBroOptions: {
        resources: [
          {
            resource: Portfolio,
            options: { properties: { contents: { type: 'richtext' } } },
          },
          {
            resource: PortfolioImage,
            options: { editProperties: ['type', 'image.file', 'PORTFOLIO_ID'] },
            features: [
              uploadFeature({
                properties: {
                  // front -> back
                  file: 'image.file',
                  // back -> front
                  filePath: 'url',
                  filename: 'image.filename',
                  filesToDelete: 'image.toDelete',
                  // db field name
                  key: 'key',
                  mimeType: 'mimeType',
                  bucket: 'bucket',
                },
                provider: {
                  gcp: {
                    bucket: 'simsimjae-portfolio.appspot.com',
                    expires: 0,
                  },
                },
                validation: { mimeTypes: ['image/jpeg', 'image/png', 'image/webp'] },
                uploadPath: (record, filename) => `images/portfolios/${record.id()}/${filename}`,
              }),
            ],
          },
          PortfolioImage,
          User,
          Review,
          Token,
        ],
        rootPath: '/admin',
      },
      [`${process.env.NODE_ENV === 'production' && 'auth'}`]: {
        authenticate: async (email, password) => {
          try {
            const user = await User.findOne({ where: { email, provider: 'email' } });
            if (compareSync(password, user.password) && user.role === 'admin') return user;
          } catch (e) {
            console.error(e);
          }
          return null;
        },
        cookieName: process.env.ADMIN_EMAIL,
        cookiePassword: process.env.ADMIN_PASSWORD,
      },
    }),
    AuthModule,
    PortfoliosModule,
    UserModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
