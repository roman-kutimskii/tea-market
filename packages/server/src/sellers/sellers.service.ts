import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  create(createSellerDto: CreateSellerDto) {
    const seller = this.sellersRepository.create();
    Object.assign(seller, createSellerDto);
    return this.sellersRepository.save(seller);
  }

  findAll() {
    return this.sellersRepository.find();
  }

  async findOne(id: number) {
    const seller = await this.sellersRepository.findOneBy({ id });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }
    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    const seller = await this.sellersRepository.findOneBy({ id: id });
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }
    Object.assign(seller, updateSellerDto);
    return this.sellersRepository.save(seller);
  }

  remove(id: number) {
    return this.sellersRepository.delete(id);
  }
}
