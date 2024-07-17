import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  autoLoadEntities: true,
  // entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
} as any;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
