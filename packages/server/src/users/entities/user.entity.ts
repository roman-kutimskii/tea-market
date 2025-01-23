import { RefreshToken } from 'src/auth/entities/refresh-token.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Sale, (sale) => sale.seller, { nullable: true })
  sellerSales: Sale[];

  @OneToMany(() => Sale, (sale) => sale.customer)
  customerSales: Sale[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
