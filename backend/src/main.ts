import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for all frontend origins
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, x-role',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve Swagger documentation from static JSON file
  const fs = require('fs');
  const path = require('path');
  const swaggerFilePath = path.join(process.cwd(), 'docs', 'swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

  SwaggerModule.setup('api', app, swaggerDocument, {
    customSiteTitle: 'CareerNest API Documentation',
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 }',
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 CareerNest API running at http://localhost:3000');
  console.log('📖 Swagger docs at http://localhost:3000/api');
}
bootstrap();
