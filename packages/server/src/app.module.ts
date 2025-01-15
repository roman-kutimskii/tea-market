import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { SellersModule } from './sellers/sellers.module';
import { ItemsModule } from './items/items.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [CommonModule, SellersModule, ItemsModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
