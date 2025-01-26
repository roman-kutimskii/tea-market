import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleToItem } from 'src/sale-to-items/entities/sale-to-item.entity';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    private usersService: UsersService,
    private itemsService: ItemsService,
    private dataSource: DataSource,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let seller: User | undefined;
      if (createSaleDto.sellerId) {
        seller = await this.usersService.findOne(createSaleDto.sellerId);
      }
      const customer = await this.usersService.findOne(
        createSaleDto.customerId,
      );

      const sale = queryRunner.manager.create(Sale, { seller, customer });
      const savedSale = await queryRunner.manager.save(Sale, sale);

      const saleToItems = [];
      for (const item of createSaleDto.items) {
        const itemEntity = await this.itemsService.findOne(item.itemId);
        const saleToItem = queryRunner.manager.create(SaleToItem, {
          sale: savedSale,
          item: itemEntity,
          quantity: item.quantity,
        });
        saleToItems.push(saleToItem);
      }
      await queryRunner.manager.save(SaleToItem, saleToItems);

      await queryRunner.commitTransaction();
      return savedSale;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private adaptSales(sales: Sale[]) {
    return sales.map((sale) => ({
      id: sale.id,
      saleToItems: sale.saleToItems.map((saleToItem) => ({
        itemId: saleToItem.item.id,
        quantity: saleToItem.quantity,
      })),
      sellerId: sale.seller?.id,
      customerId: sale.customer.id,
    }));
  }

  async findAll() {
    const sales = await this.salesRepository.find({
      relations: ['saleToItems', 'saleToItems.item', 'seller', 'customer'],
    });

    return this.adaptSales(sales);
  }

  async findOne(id: number) {
    try {
      const sale = await this.salesRepository.findOneOrFail({
        where: { id },
        relations: ['saleToItems', 'saleToItems.item', 'seller', 'customer'],
      });
      return this.adaptSales([sale])[0];
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async findByCustomerId(customerId: number) {
    const sales = await this.salesRepository.find({
      where: [{ customer: { id: customerId } }],
      relations: ['saleToItems', 'saleToItems.item', 'seller', 'customer'],
    });
    return this.adaptSales(sales);
  }

  async findBySellerId(sellerId: number) {
    const sales = await this.salesRepository.find({
      where: [{ seller: { id: sellerId } }],
      relations: ['saleToItems', 'saleToItems.item', 'seller', 'customer'],
    });
    return this.adaptSales(sales);
  }

  async update(id: number, updateSaleDto: UpdateSaleDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const sale = await this.findOne(id);

      if (updateSaleDto.sellerId) {
        sale.sellerId = updateSaleDto.sellerId;
      }

      if (updateSaleDto.customerId) {
        sale.customerId = updateSaleDto.customerId;
      }

      const updatedSale = await queryRunner.manager.save(Sale, sale);

      if (updateSaleDto.items) {
        if (sale.saleToItems.length) {
          await queryRunner.manager.delete(SaleToItem, sale.saleToItems);
        }

        const saleToItems = [];
        for (const item of updateSaleDto.items) {
          const itemEntity = await this.itemsService.findOne(item.itemId);
          const saleToItem = queryRunner.manager.create(SaleToItem, {
            sale: updatedSale,
            item: itemEntity,
            quantity: item.quantity,
          });
          saleToItems.push(saleToItem);
        }
        await queryRunner.manager.save(SaleToItem, saleToItems);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.salesRepository.delete(id);
  }
}
