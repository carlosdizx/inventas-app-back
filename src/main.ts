import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

const bootstrap = async () => {
  const configService = new ConfigService();

  const env = configService.get('NODE_ENV', 'development') === 'production';

  const logLevel: LogLevel[] = env
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

  if (!env) {
    const config = new DocumentBuilder()
      .setTitle('Documentación Inventas App')
      .setDescription('Gestiona usuarios, productos, ventas y más.')
      .setVersion('1.0')
      .addTag('Inventas App')
      .setContact(
        'Ernesto Díaz Basante',
        'https://github.com/carlosdizx',
        'inventasapp@gmail.com',
      )
      .setLicense('MIT', 'https://opensource.org/licenses/MIT')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));

    SwaggerModule.setup('documentation', app, document);
  }

  const port = configService.getOrThrow<string>('APP_PORT');
  await app.listen(port);

  Logger.debug(`Running application at http://localhost:${port}/`);
};

(async () => {
  await bootstrap();
})();
