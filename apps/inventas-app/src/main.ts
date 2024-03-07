import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.APP_CORS.split(','),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.APP_PORT;
  const prefix = process.env.APP_PREFIX;
  app.setGlobalPrefix(prefix);
  await app.listen(port);
  console.log('Running application at', `...:${port}/${prefix}/`);
};

(async () => {
  await bootstrap();
})();
