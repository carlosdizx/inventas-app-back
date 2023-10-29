import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import AuthService from '../auth/auth.service';
import ErrorDatabaseService from '../common/service/error.database.service';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    private readonly authService: AuthService,
    private readonly errorDatabaseService: ErrorDatabaseService,
  ) {}

  public registerEnterprise = async ({
    user,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    const enterprise = this.enterpriseRepository.create({
      ...resDataEnterprise,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const enterpriseSave = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );
      await queryRunner.commitTransaction();
      await queryRunner.release();
      // const userSaved = await this.authService.createUser(user);
      return enterpriseSave;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
