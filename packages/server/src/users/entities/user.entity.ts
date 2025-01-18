import { Sale } from 'src/sales/entities/sale.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Sale, (sale) => sale.seller)
  sales: Sale[];
}
