import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private s3Service: S3Service,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const { imageBase64, ...data } = createItemDto;
    let imageUrl: string | undefined;
    if (imageBase64) {
      imageUrl = await this.s3Service.uploadBase64Image(imageBase64);
    }
    const item = this.itemsRepository.create({ imageUrl, ...data });
    return this.itemsRepository.save(item);
  }

  async findAll(
    page?: number,
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

    if (page && limit) {
      query.offset((page - 1) * limit);
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
      .where('item.name LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const { imageBase64, ...data } = updateItemDto;
    let imageUrl: string | undefined;
    if (imageBase64) {
      imageUrl = await this.s3Service.uploadBase64Image(imageBase64);
    }
    const item = await this.findOne(id);
    Object.assign(item, { imageUrl, ...data });
    return this.itemsRepository.save(item);
  }

  remove(id: number) {
    return this.itemsRepository.delete(id);
  }
}
