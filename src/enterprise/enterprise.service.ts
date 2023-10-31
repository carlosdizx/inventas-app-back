import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import ErrorDatabaseService from '../common/service/error.database.service';
import User from '../auth/entities/user.entity';
import UserDetails from '../auth/entities/user.details.entity';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import EncryptService from '../common/service/encrypt.service';
import UserCrudService from '../auth/user.crud.service';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly userCrudService: UserCrudService,
  ) {}

  public createEnterpriseAndUser = async ({
    user,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    const enterprise = this.enterpriseRepository.create({
      ...resDataEnterprise,
      status: StatusEntity.ACTIVE,
    });

    const resUser = await this.userCrudService.createUser(user);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      resUser.user.enterprise = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
