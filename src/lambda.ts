import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@codegenie/serverless-express';
import { Context, Handler } from 'aws-lambda';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import AppModule from './app.module';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common/services/logger.service';

let cachedServer: Handler;

const bootstrap = async () => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    const configService = new ConfigService(nestApp);
    const env = configService.get('NODE_ENV', 'development') === 'production';
    const logLevel: LogLevel[] = env
      ? ['error', 'warn', 'fatal']
      : ['error', 'warn', 'log', 'debug', 'fatal', 'verbose'];

    nestApp.useLogger(logLevel);

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

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
};

export const handler = async (event: any, context: Context, callback: any) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
