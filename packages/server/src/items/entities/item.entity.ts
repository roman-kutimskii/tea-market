import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.item)
  saleToItems: SaleToItem[];
}
