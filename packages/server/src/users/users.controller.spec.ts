import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        phoneNumber: '+12345678900',
      };

      await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
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
      const userId = '1';

      await controller.findOne(userId);

      expect(service.findOne).toHaveBeenLastCalledWith(+userId);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { name: 'John Updated' };

      await controller.update(userId, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const userId = '1';

      await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(+userId);
    });
  });
});
