import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';

const bootstrap = async () => {
  const configService = new ConfigService();

  const usageHttps = configService.get<string>('APP_HTTPS', 'false') === 'true';
  let app: INestApplication;

  if (usageHttps) {
    const httpsOptions: HttpsOptions = {
      key: fs.readFileSync('private.key'),
      cert: fs.readFileSync('certificate.crt'),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else app = await NestFactory.create(AppModule);

  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.getOrThrow<string>('APP_PORT');
  await app.listen(port);

  Logger.debug(
    `Running application at ${usageHttps ? `https` : `http`}://[...]:${port}/`,
  );
};

(async () => {
  await bootstrap();
})();
