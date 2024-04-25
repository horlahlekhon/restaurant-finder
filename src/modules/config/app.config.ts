import * as process from 'process';

export default () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
