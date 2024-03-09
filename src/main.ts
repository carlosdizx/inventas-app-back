import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow<string>('APP_CORS').split(','),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.getOrThrow<string>('APP_PORT');
  const prefix = configService.getOrThrow<string>('APP_PREFIX');
  app.setGlobalPrefix(prefix);
  await app.listen(port);
  console.log('Running application at', `...:${port}/${prefix}/`);
};

(async () => {
  await bootstrap();
})();
