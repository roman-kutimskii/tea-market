import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.item)
  saleToItems: SaleToItem[];

  @Column('tsvector', { select: false, nullable: true, name: 'search_vector' })
  searchVector: string;
}
