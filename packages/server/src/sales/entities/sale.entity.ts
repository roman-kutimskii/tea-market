import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (seller) => seller.sellerSales, { nullable: true })
  seller: User;

  @ManyToOne(() => User, (customer) => customer.customerSales)
  customer: User;

  @OneToMany(() => SaleToItem, (saleToItem) => saleToItem.sale, {
    cascade: ['remove'],
  })
  saleToItems: SaleToItem[];
}
