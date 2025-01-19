import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { ItemsModule } from 'src/items/items.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), ItemsModule, UsersModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
