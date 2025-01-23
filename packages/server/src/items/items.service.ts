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

  async findAll(
    lastId?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
    filterBy?: string,
    filterValue?: string,
  ) {
    const query = this.itemsRepository
      .createQueryBuilder('item')
      .orderBy(sortBy ? `item.${sortBy}` : 'item.id', sortOrder || 'ASC');

    if (filterBy && filterValue) {
      query.where(`item.${filterBy} = :filterValue`, { filterValue });
    }

    const count = await query.getCount();

    if (limit) {
      query.limit(limit);
    }

    if (lastId) {
      query.andWhere('item.id > :lastId', { lastId });
    }

    return { items: await query.getMany(), count };
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

  search(query: string) {
    return this.itemsRepository
      .createQueryBuilder('item')
      .where('item.searchVector @@ plainto_tsquery(:query)', { query })
      .getMany();
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
