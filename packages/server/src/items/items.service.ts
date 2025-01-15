import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  create(createItemDto: CreateItemDto) {
    const item = this.itemsRepository.create(createItemDto);
    return this.itemsRepository.save(item);
  }

  findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    try {
      const item = await this.itemsRepository.findOneByOrFail({ id });
      return item;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    try {
      const item = await this.itemsRepository.findOneByOrFail({ id });
      Object.assign(item, updateItemDto);
      return this.itemsRepository.save(item);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.itemsRepository.delete(id);
  }
}
