import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './config/swagger-config/swagger-config.service';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('tea-market/api');
  app.get(SwaggerConfigService).setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(json({ limit: '10mb' }));

  await app.listen(3000);
}
bootstrap();
