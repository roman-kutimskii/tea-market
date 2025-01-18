import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CreateUserWithRoleDto } from './dto/create-user-with-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserWithRoleDto) {
    // TODO: Добавить транзакцию, чтобы не увеличивать счетчик id
    try {
      const user = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error?.code === '23505') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id });
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOneByOrFail({ email });
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error);
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
