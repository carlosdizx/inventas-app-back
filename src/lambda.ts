import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@codegenie/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: Handler;

const bootstrap = async () => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    nestApp.enableCors({
      origin: ['https://example.com', 'https://another-example.com'],
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: '*',
    });

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

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('documentation', nestApp, document);

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
};

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
