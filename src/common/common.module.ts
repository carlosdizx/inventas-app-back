import { Global, Module } from '@nestjs/common';
import ErrorService from './util/error.service';

@Global()
@Module({
  providers: [ErrorService],
  exports: [ErrorService],
})
export default class CommonModule {}
