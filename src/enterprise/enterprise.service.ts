import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import ErrorDatabaseService from '../common/service/error.database.service';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import EncryptService from '../common/service/encrypt.service';
import UserCrudService from '../auth/user.crud.service';
import User from '../auth/entities/user.entity';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
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

    const userSaved = await this.userCrudService.createUser(user);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      userSaved.user.enterprise = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );

      await queryRunner.manager.save<User>(userSaved.user);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await this.userCrudService.deleteUserById(userSaved.user.id);
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
