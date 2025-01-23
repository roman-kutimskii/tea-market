import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  @Column('money')
  price: number;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.item)
  saleToItems: SaleToItem[];

  @Column('tsvector', { select: false, nullable: true, name: 'search_vector' })
  searchVector: string;

  @Column()
  type: string;

  @Column()
  originCountry: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: 'int', nullable: true })
  harvestYear: number;

  @Column({ nullable: true })
  manufacturer: string;
}
