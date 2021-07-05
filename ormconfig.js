const dotenv = require('dotenv');
dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.env.dev' : process.env.NODE_ENV === 'production' ? '.env.prod' : '' });

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/entities/**/*.entity.js'],
  seeds: ['dist/**/seeds/**/*.seed.js'],
  factories: ['dist/**/factories/**/*.factory.js'],
  synchronize: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production',
  logging: process.env.NODE_ENV === 'development',
  extra: {
    connectionLimit: 10,
  },
};
