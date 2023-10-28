import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@Injectable()
export default class ErrorDatabaseService {
  private readonly logger = new Logger();
  public handleException = (error: any, context = 'AppServiceFailed') => {
    switch (error.code) {
      case '23505':
        throw new ConflictException(`Campo repetido: ${error.detail}`);
      case '23503':
        throw new BadRequestException(error.detail);
      case '23502':
        throw new BadRequestException(
          `Campo nulo: ${error.column}, ${error.driverError}`,
        );
      default:
        this.logger.error(error, '', context);
        console.log(error);
        throw new InternalServerErrorException(
          'Unexpected error, check server logs',
        );
    }
  };
}
