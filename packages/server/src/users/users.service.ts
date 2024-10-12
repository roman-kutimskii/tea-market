import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create();
    user.name = createUserDto.name;
    user.email = createUserDto.email;

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
