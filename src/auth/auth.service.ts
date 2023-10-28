import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRoles } from './enums/user.roles.enum';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public createUser = async () => {
    const user = this.userRepository.create({
      email: 'ernestodiaz@mail.com',
      password: '12345678',
      roles: [UserRoles.OWNER],
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
    }
  };
}
