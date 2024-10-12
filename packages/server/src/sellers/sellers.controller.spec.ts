import { Test, TestingModule } from '@nestjs/testing';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

describe('SellersController', () => {
  let controller: SellersController;
  let service: SellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [
        {
          provide: SellersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SellersController>(SellersController);
    service = module.get<SellersService>(SellersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct data', async () => {
      const createSellerDto: CreateSellerDto = {
        surname: 'Doe',
        password: 'password',
      };

      await controller.create(createSellerDto);

      expect(service.create).toHaveBeenCalledWith(createSellerDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const sellerId = '1';

      await controller.findOne(sellerId);

      expect(service.findOne).toHaveBeenLastCalledWith(+sellerId);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const sellerId = '1';
      const updateSellerDto: UpdateSellerDto = { surname: 'Doe Updated' };

      await controller.update(sellerId, updateSellerDto);

      expect(service.update).toHaveBeenCalledWith(+sellerId, updateSellerDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const sellerId = '1';

      await controller.remove(sellerId);

      expect(service.remove).toHaveBeenCalledWith(+sellerId);
    });
  });
});
