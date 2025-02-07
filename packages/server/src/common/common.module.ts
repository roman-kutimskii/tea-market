import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'src/config/database-config/database-config.service';
import databaseConfig from 'src/config/database.config';
import jwtConfig from 'src/config/jwt.config';
import s3Config from 'src/config/s3.config';
import { SwaggerConfigService } from 'src/config/swagger-config/swagger-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig, jwtConfig, s3Config] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
  ],
  providers: [SwaggerConfigService, DatabaseConfigService],
  exports: [SwaggerConfigService, DatabaseConfigService],
})
export class CommonModule {}
