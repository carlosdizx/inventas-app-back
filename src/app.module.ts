import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import JoiValidation from './common/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import ClientsModule from './clients/clients.module';
import InventoriesModule from './inventories/inventories.module';
import SalesModule from './sales/sales.module';
import ProductsModule from './products/products.module';
import CategoriesModule from './categories/categories.module';
import EnterpriseModule from './enterprise/enterprise.module';
import PaymentsModule from './payments/payments.module';
import { dataSourceOptions } from '../database/database.config';
import { OtpVerifyMiddleware } from './common/middlewares/otp-verify.middleware';
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
    ClientsModule,
    PaymentsModule,
  ],
  controllers: [],
})
export default class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OtpVerifyMiddleware)
      .forRoutes(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/:id', method: RequestMethod.PATCH },
      );
  }
}
