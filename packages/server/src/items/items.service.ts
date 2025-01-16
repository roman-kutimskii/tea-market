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

  findAll(lastId?: number, limit?: number) {
    const query = this.itemsRepository
      .createQueryBuilder('item')
      .orderBy('item.id');

    if (limit) {
      query.limit(limit);
    }

    if (lastId) {
      query.where('item.id > :lastId', { lastId });
    }

    return query.getMany();
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
    const item = await this.findOne(id);
    Object.assign(item, updateItemDto);
    return this.itemsRepository.save(item);
  }

  remove(id: number) {
    return this.itemsRepository.delete(id);
  }
}
