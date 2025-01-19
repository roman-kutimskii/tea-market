import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import migrations from 'src/migrations';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: migrations,
  entities: [__dirname + '/../**/*.entity.ts'],
};

export const dataSource = new DataSource(dataSourceOptions);
