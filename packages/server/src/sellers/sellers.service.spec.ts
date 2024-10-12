import { Test, TestingModule } from '@nestjs/testing';
import { SellersService } from './sellers.service';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateSellerDto } from './dto/create-seller.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateSellerDto } from './dto/update-seller.dto';

describe('SellersService', () => {
  let service: SellersService;
  let repository: Repository<Seller>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellersService,
        { provide: getRepositoryToken(Seller), useClass: Repository },
      ],
    }).compile();

    service = module.get<SellersService>(SellersService);
    repository = module.get<Repository<Seller>>(getRepositoryToken(Seller));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a seller', async () => {
      const createSellerDto: CreateSellerDto = {
        surname: 'Doe',
        password: 'password',
      };
      const seller = { id: 1, ...createSellerDto };

      jest.spyOn(repository, 'create').mockReturnValue(seller);
      jest.spyOn(repository, 'save').mockResolvedValue(seller);

      expect(await service.create(createSellerDto)).toEqual(seller);
      expect(repository.create).toHaveBeenCalledWith();
      expect(repository.save).toHaveBeenCalledWith(seller);
    });
  });

  describe('findAll', () => {
    it('should return an array of sellers', async () => {
      const sellers = [{ id: 1, surname: 'Doe', password: 'password' }];

      jest.spyOn(repository, 'find').mockResolvedValue(sellers);

      expect(await service.findAll()).toEqual(sellers);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a seller', async () => {
      const seller = { id: 1, surname: 'Doe', password: 'password' };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(seller);

      expect(await service.findOne(1)).toEqual(seller);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if seller not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update a seller', async () => {
      const updateSellerDto: UpdateSellerDto = { surname: 'Doe Updated' };
      const seller = { id: 1, surname: 'Doe', password: 'password' };
      const updatedSeller = { ...seller, ...updateSellerDto };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(seller);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedSeller);

      expect(await service.update(1, updateSellerDto)).toEqual(updatedSeller);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedSeller);
    });

    it('should throw NotFoundException if seller not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update(1, { surname: 'Doe Updated' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('remove', () => {
    it('should remove a seller', async () => {
      const result = { affected: 1, raw: [] };

      jest.spyOn(repository, 'delete').mockResolvedValue(result);

      expect(await service.remove(1)).toEqual(result);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
