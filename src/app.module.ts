import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import JoiValidation from './common/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import ClientsModule from './clients/clients.module';
import DatabaseControlModule from './database-control/database-control.module';
import InventoriesModule from './inventories/inventories.module';
import SalesModule from './sales/sales.module';
import ProductsModule from './products/products.module';
import CategoriesModule from './categories/categories.module';
import EnterpriseModule from './enterprise/enterprise.module';
import PaymentsModule from './payments/payments.module';
import { dataSourceOptions } from '../database/database.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    CommonModule,
    AuthModule,
    EnterpriseModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
    InventoriesModule,
    DatabaseControlModule,
    ClientsModule,
    PaymentsModule,
  ],
  controllers: [],
})
export default class AppModule {}
