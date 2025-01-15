import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seller, (seller) => seller.sales)
  seller: Seller;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.sale, {
    cascade: ['remove'],
  })
  saleToItems: SaleToItem[];
}
