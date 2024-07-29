import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import AppModule from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

let cachedServer: (arg0: any, arg1: any) => any;

const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    nestApp.enableCors({
      origin: '*',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: '*',
    });

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

    const document = SwaggerModule.createDocument(nestApp, config);
    SwaggerModule.setup('api', nestApp, document);

    await nestApp.init();

    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context);
};

export { handler };
