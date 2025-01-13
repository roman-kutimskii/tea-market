import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './config/swagger-config/swagger-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('tea-market/api');
  app.get(SwaggerConfigService).setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
