import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import UserDetails from './entities/user.details.entity';
import CreateUserDto from './dto/create-user.dto';
import ErrorDatabaseService from '../common/service/error.database.service';

@Injectable()
export default class AuthService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      details.user = await queryRunner.manager.save<User>(user);
      await queryRunner.manager.save<UserDetails>(details);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
    await queryRunner.release();
  };
}
