import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');
  const openApiConfig = new DocumentBuilder()
    .setTitle('ecommerce_fullstack_app_coffee_api')
    .setDescription('API for the ecommerce fullstack app coffee using NestJS, TypeORM and PostgreSQL')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, openApiConfig);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
