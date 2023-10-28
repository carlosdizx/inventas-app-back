import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import UserDetails from './entities/user.details.entity';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export default class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
  ) {}

  public createUser = async ({
    email,
    password,
    roles,
    first_name,
    last_name,
    documentType,
    documentNumber,
    gender,
    birthdate,
    phone,
  }: CreateUserDto) => {
    const user = this.userRepository.create({
      email,
      password,
      roles,
    });

    const details = this.userDetailsRepository.create({
      first_name,
      last_name,
      documentType,
      documentNumber,
      gender,
      birthdate,
      phone,
    });

    try {
      details.user = await this.userRepository.save(user);
      await this.userDetailsRepository.save(details);
    } catch (error) {
      console.log(error);
    }
  };
}
