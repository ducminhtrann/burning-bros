import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Burning Bros')
    .setDescription('The Burning Bros API Description')
    .setVersion('1.0')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  SwaggerModule.setup('api-docs', app, document);
  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT);
  Logger.log(`BURNING BROS SERVICE IS RUNNING ON PORT ${process.env.PORT}`);
}
bootstrap();
