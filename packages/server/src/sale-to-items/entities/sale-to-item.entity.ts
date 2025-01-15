import { Item } from 'src/items/entities/item.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sale_to_items')
export class SaleToItem {
  @PrimaryGeneratedColumn()
  saleToItemId: number;

  @Column()
  itemId: number;

  @Column()
  saleId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Item, (item) => item.saleToItems)
  item: Item;

  @ManyToOne(() => Sale, (sale) => sale.saleToItems)
  sale: Sale;
}
