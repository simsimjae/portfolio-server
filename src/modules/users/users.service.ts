import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async findOne(id) {
    return await this.usersRepository.findOne({ id });
  }

  async create(dto: CreateUserDto) {
    return await this.usersRepository.create(dto);
  }
}
