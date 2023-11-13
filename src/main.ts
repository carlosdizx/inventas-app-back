import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
  console.log('Running application in', `http://localhost:${port}/${prefix}/`);
};

(async () => {
  await bootstrap();
})();
