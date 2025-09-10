import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'ecommerce_fullstack_app_coffee',
  entities: [path.join(__dirname, '../../**/*.entity{.ts,.js}')],
  migrations: [
    path.join(__dirname, '../db/migrations/*.ts'),
    path.join(__dirname, '../db/seeds/*.ts'),
  ],
  synchronize: false,
  logging: false,
};

const appDataSource = new DataSource(typeOrmConfig);
export default appDataSource;
