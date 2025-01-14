import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfigService {
  createSwaggerDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
      .setTitle('Tea Market API Reference')
      .build();

    return SwaggerModule.createDocument(app, config);
  }

  setupSwagger(app: INestApplication) {
    const document = this.createSwaggerDocument(app);
    SwaggerModule.setup('swagger', app, document, {
      useGlobalPrefix: true,
    });
  }
}
