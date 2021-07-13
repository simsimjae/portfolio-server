import { Module } from '@nestjs/common';
import { AdminModule as AdminBroModule } from '@admin-bro/nestjs';
import { User } from '../users/entities/user.entity';
import { Token } from '../auth/entities/token.entity';
import { Review } from '../reviews/entities/review.entity';
import { Portfolio } from '../portfolios/entities/portfolio.entity';
import { compareSync } from 'bcrypt';
import uploadFeature from '@admin-bro/upload';
import { PortfolioImage } from '../portfolios/entities/portfolioImage.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import AdminBro from 'admin-bro';

@Module({
  imports: [
    AdminBroModule.createAdmin({
      adminBroOptions: {
        resources: [
          {
            resource: Portfolio,
            options: {
              properties: {
                contents: {
                  components: {
                    // list: AdminBro.bundle('../../../src/modules/admin/components/Editor/Editor.tsx'),
                    edit: AdminBro.bundle('../../../src/modules/admin/components/Editor/Editor.tsx'),
                    show: AdminBro.bundle('../../../src/modules/admin/components/Editor/Editor.tsx'),
                  },
                },
              },
            },
          },
          {
            resource: PortfolioImage,
            options: { editProperties: ['type', 'image.file', 'PORTFOLIO_ID'] },
            features: [
              uploadFeature({
                properties: {
                  file: 'image.file',
                  filePath: 'url',
                  filename: 'image.filename',
                  filesToDelete: 'image.toDelete',
                  // db field name
                  key: 'key',
                  size: 'size',
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
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
