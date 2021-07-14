import AdminBro from 'admin-bro';
import { Portfolio } from '../../../modules/portfolios/entities/portfolio.entity';

export const PortfolioResource = {
  resource: Portfolio,
  options: {
    properties: {
      contents: {
        components: {
          // list: AdminBro.bundle('../../../src/modules/admin/components/Editor/Editor.tsx'),
          edit: AdminBro.bundle('../../../../src/modules/admin/components/Editor/Editor.tsx'),
          show: AdminBro.bundle('../../../../src/modules/admin/components/Editor/Editor.tsx'),
        },
      },
    },
  },
};
