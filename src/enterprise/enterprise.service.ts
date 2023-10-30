import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import AuthService from '../auth/auth.service';
import ErrorDatabaseService from '../common/service/error.database.service';
import User from '../auth/entities/user.entity';
import UserDetails from '../auth/entities/user.details.entity';
import { hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import EncryptService from '../common/service/encrypt.service';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly authService: AuthService,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
  ) {}

  public createEnterpriseAndUser = async ({
    user,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    const enterprise = this.enterpriseRepository.create({
      ...resDataEnterprise,
      status: StatusEntity.ACTIVE,
    });
    const {
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
    } = user;

    const newUser = this.userRepository.create({
      email: email,
      password: await hashPassword(this.encryptService.encrypt(password)),
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
      newUser.enterprise = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );
      details.user = await queryRunner.manager.save<User>(newUser);
      await queryRunner.manager.save<UserDetails>(details);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
