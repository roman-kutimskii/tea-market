import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  itemId: number;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.item)
  saleToItems: SaleToItem[];
}
