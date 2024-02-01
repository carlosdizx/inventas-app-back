import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '../../**/*.migration{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: configService.get('DB_SYNCHRONIZE', false),
});
console.log('password', process.env.DB_PASSWORD);

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '../../**/*.migration{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
