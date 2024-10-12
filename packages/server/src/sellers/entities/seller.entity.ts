import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  surname: string;

  @Column()
  password: string;
}
