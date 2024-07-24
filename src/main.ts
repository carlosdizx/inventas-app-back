import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';

const bootstrap = async () => {
  const configService = new ConfigService();

  const logLevel: LogLevel[] =
    configService.get('NODE_ENV') === 'production'
      ? ['error', 'warn', 'fatal']
      : ['error', 'warn', 'log', 'debug', 'fatal', 'verbose'];

  const app: INestApplication = await NestFactory.create(AppModule);

  app.useLogger(logLevel);
  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.getOrThrow<string>('APP_PORT');
  await app.listen(port);

  Logger.debug(`Running application at http://localhost:${port}/`);
};

(async () => {
  await bootstrap();
})();
