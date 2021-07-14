const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV;
const path = NODE_ENV === 'development' ? '.env.dev' : NODE_ENV === 'test' ? '.env.test' : NODE_ENV === 'production' ? '.env.prod' : '';
dotenv.config({ path });

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
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  maxQueryExecutionTime: 1000,
  extra: {
    connectionLimit: 10,
  },
};
