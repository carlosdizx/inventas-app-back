import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '../../**/*.migration{.ts,.js}'],
  synchronize: configService.get('DB_SYNCHRONIZE', true),
});
export default getTypeOrmConfig;
