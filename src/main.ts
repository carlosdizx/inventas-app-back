import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import * as fs from 'fs';

const bootstrap = async () => {
  const httpsOptions: HttpsOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.getOrThrow<string>('APP_PORT');
  await app.listen(port);
  console.log('Running application at', `...:${port}/`);
};

(async () => {
  await bootstrap();
})();
