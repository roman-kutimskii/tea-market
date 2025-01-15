import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  create(createSellerDto: CreateSellerDto) {
    const seller = this.sellersRepository.create(createSellerDto);
    return this.sellersRepository.save(seller);
  }

  findAll() {
    return this.sellersRepository.find();
  }

  async findOne(id: number) {
    try {
      const seller = await this.sellersRepository.findOneByOrFail({ id });
      return seller;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    try {
      const seller = await this.sellersRepository.findOneByOrFail({ id });
      Object.assign(seller, updateSellerDto);
      return this.sellersRepository.save(seller);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.sellersRepository.delete(id);
  }
}
