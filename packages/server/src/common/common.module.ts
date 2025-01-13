import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from 'src/config/database-config/database-config.service';
import databaseConfig from 'src/config/database.config';
import { SwaggerConfigService } from 'src/config/swagger-config/swagger-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [databaseConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfigService,
    }),
  ],
  providers: [SwaggerConfigService, DatabaseConfigService],
  exports: [SwaggerConfigService, DatabaseConfigService],
})
export class CommonModule {}
