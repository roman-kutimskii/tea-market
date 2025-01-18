import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { SalesModule } from './sales/sales.module';
import { SaleToItemsModule } from './sale-to-items/sale-to-items.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    UsersModule,
    ItemsModule,
    SalesModule,
    SaleToItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
