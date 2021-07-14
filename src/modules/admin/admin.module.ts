import { MulterModule } from './multer.module';
import { Module } from '@nestjs/common';
import { AdminModule as NestAdminModule } from '@admin-bro/nestjs';
import { User } from '../users/entities/user.entity';
import { Token } from '../auth/entities/token.entity';
import { Review } from '../reviews/entities/review.entity';
import { compareSync } from 'bcrypt';
import { AdminController } from './admin.controller';
import { ConfigService } from '../config/config.service';
import { PortfolioResource } from './resources/portfolio.resource';
import { PortfolioImageResource } from './resources/portfolio-image.resource';

@Module({
  imports: [
    MulterModule,
    NestAdminModule.createAdminAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        adminBroOptions: {
          resources: [PortfolioResource, PortfolioImageResource(configService.get('GCP_BUCKET_NAME'), configService.get('GCP_BUCKET_PATH')), User, Review, Token],
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
          cookieName: configService.get('ADMIN_EMAIL'),
          cookiePassword: configService.get('ADMIN_PASSWORD'),
        },
      }),
    }),
  ],
  controllers: [AdminController],
})
export class AdminModule {}
