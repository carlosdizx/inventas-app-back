import { Injectable } from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import ErrorDatabaseService from '../common/service/error.database.service';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import UserCrudService from '../auth/user.crud.service';
import User from '../auth/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    private readonly errorDatabaseService: ErrorDatabaseService,
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
    console.log(userSaved);

    enterprise.owner = userSaved.user;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      userSaved.user.enterprise = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );

      await queryRunner.manager.save<User>(userSaved.user);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return { message: 'Success' };
    } catch (error) {
      await this.userCrudService.deleteUserById(userSaved.user.id);
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public listEnterprises = async ({ page, limit }: IPaginationOptions) => {
    const queryBuilder =
      this.enterpriseRepository.createQueryBuilder('enterprise');
    return await paginate<Enterprise>(queryBuilder, {
      page,
      limit,
      route: 'enterprise',
    });
  };

  public findEnterpriseById = async (id: string) => {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id },
    });

    delete enterprise.createdAt;
    delete enterprise.updatedAt;
    return { ...enterprise, id: undefined };
  };
}
