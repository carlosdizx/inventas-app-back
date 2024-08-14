import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const bootstrap = async () => {
  const configService = new ConfigService();

  const env = configService.get('NODE_ENV', 'development') === 'production';

  const logLevel: LogLevel[] = env
    ? ['error', 'warn', 'fatal']
    : ['error', 'warn', 'log', 'debug', 'fatal', 'verbose'];

  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: logLevel,
  });

  app.enableCors({});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Documentación Inventas App')
    .setDescription('Gestiona usuarios, productos, ventas y más.')
    .setVersion('1.0')
    .setContact(
      'Technology Box',
      'https://github.com/carlosdizx',
      'inventasapp@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('documentation', app, document);

  const port = configService.getOrThrow<string>('APP_PORT');
  await app.listen(port);

  Logger.debug(`Running application at http://localhost:${port}/`);
};

(async () => {
  console.log('Starting App 🟡');
  await bootstrap();
  console.log('Started App 🟢');
})();
