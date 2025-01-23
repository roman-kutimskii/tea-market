import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { genSalt, hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { password, ...data } = createUserDto;
      const salt = await genSalt();
      const passwordHash = await hash(password, salt);
      const user = queryRunner.manager.create(User, { passwordHash, ...data });

      const savedUser = await queryRunner.manager.save(User, user);
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error?.code === '23505') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    } finally {
      await queryRunner.release();
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
