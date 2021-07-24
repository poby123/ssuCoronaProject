import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './domain/User';
import { Repository } from 'typeorm/index';

@Injectable()
export class UserService {
  
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    this.userRepository = userRepository;
  }


  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }


  findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ userId: id });
  }


  async saveUser(user: User): Promise<void> {
    await this.userRepository.save(user);
  }


  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete({ userId: id });
  }

}