import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { SellersModule } from './sellers/sellers.module';
import { ItemsModule } from './items/items.module';
import { SalesModule } from './sales/sales.module';
import { SaleToItemsModule } from './sale-to-items/sale-to-items.module';

@Module({
  imports: [
    CommonModule,
    SellersModule,
    ItemsModule,
    SalesModule,
    SaleToItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
