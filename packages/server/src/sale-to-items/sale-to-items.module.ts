import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleToItem } from './entities/sale-to-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleToItem])],
})
export class SaleToItemsModule {}
