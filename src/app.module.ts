import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JoiValidation from './common/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from '../database/database.config';
import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import InventoriesModule from './inventories/inventories.module';
import SalesModule from './sales/sales.module';
import ProductsModule from './products/products.module';
import CategoriesModule from './categories/categories.module';
import EnterpriseModule from './enterprise/enterprise.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    CommonModule,
    AuthModule,
    EnterpriseModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
    InventoriesModule,
  ],
})
export default class AppModule {}
