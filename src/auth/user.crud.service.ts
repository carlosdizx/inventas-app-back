import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import EncryptService from '../common/service/encrypt.service';
import CreateUserDto from './dto/create-user.dto';
import { hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import UserDetails from './entities/user.details.entity';

@Injectable()
export default class UserCrudService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
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
    const newUser = this.userRepository.create({
      email: email,
      password: this.encryptService.encrypt(await hashPassword(password)),
      roles: roles,
      status: StatusEntity.ACTIVE,
    });

    const details = this.userDetailsRepository.create({
      first_name: first_name,
      last_name: last_name,
      documentType: documentType,
      documentNumber: documentNumber,
      gender: gender,
      birthdate: birthdate,
      phone: phone,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      details.user = await queryRunner.manager.save<User>(newUser);
      await queryRunner.manager.save<UserDetails>(details);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      delete details.user.password;
      return details;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
