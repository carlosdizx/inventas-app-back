import { QueryFailedError } from 'typeorm';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(QueryFailedError)
export default class TypeormExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    this.logger.error(exception, TypeormExceptionFilter.name);
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    const { url } = request;
    let statusError: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    const { name, driverError } = exception;

    if (exception.message.includes('unique constraint')) {
      statusError = HttpStatus.CONFLICT;
      message = `Ya existe un registro: ${driverError.detail
        .split(')=(')[1]
        .replace(') already exists.', '')}`;
    }
    const errorResponse = {
      path: url,
      timestamp: new Date().toISOString(),
      name,
      message,
    };
    response.status(statusError).json(errorResponse);
  }
}
