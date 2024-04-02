import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import ErrorDatabaseService from '../common/service/error.database.service';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import UserCrudService from '../auth/user.crud.service';
import User from '../auth/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import ChangeStatusDto from '../common/dto/change-status.dto';
import PlanService from './plan.service';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly userCrudService: UserCrudService,
    private readonly planService: PlanService,
  ) {}

  public createEnterpriseAndUser = async ({
    user,
    planId,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    if (planId) {
      const plan = await this.planService.findOneBy({ id: planId });
      if (!plan) throw new NotFoundException('Plan no encontrado');

      resDataEnterprise['plan'] = plan;
    }

    const enterprise = this.enterpriseRepository.create({
      ...resDataEnterprise,
      status: StatusEntity.ACTIVE,
    });

    const userSaved = await this.userCrudService.createUser(user);

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
      return {
        title: `Empresa registrada con exito`,
        message:
          'La empresa ha sido registrada exitosamente.<br/>' +
          ' Se ha enviado un correo electrónico con la contraseña de acceso a la plataforma.',
      };
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

  public findEnterpriseAndOwnerById = async (id: string) => {
    const enterprise = await this.enterpriseRepository.findOne({
      where: { id },
      relations: ['owner', 'owner.userDetails', 'plan'],
    });

    if (!enterprise) throw new NotFoundException('Empresa no encontrada');

    const user = {
      ...enterprise.owner,
      ...enterprise.owner.userDetails,
      id: undefined,
    };

    delete enterprise.createdAt;
    delete enterprise.updatedAt;
    return {
      ...enterprise,
      user,
      id: undefined,
      owner: undefined,
    };
  };

  public findOneBy = async (filter: any) =>
    await this.enterpriseRepository.findOneBy(filter);

  public changeStatus = async (id: string, { status }: ChangeStatusDto) => {
    const enterprise = await this.findOneBy({ id });
    if (!enterprise) throw new NotFoundException('Empresa no encontrada');

    if (
      (enterprise.status === StatusEntity.ACTIVE ||
        enterprise.status === StatusEntity.INACTIVE) &&
      (status === StatusEntity.PENDING_CONFIRMATION ||
        status === StatusEntity.PENDING_APPROVAL)
    )
      throw new ConflictException(
        'No puedes revertir el estado de este registro a este estado',
      );

    enterprise.status = status;

    return await this.enterpriseRepository.save(enterprise);
  };

  public changePlanEnterprise = async (id: string, planId: string) => {
    const enterprise = await this.findOneBy({ id });
    if (!enterprise) throw new NotFoundException('Empresa no encontrada');

    const plan = await this.planService.findOneBy({ id: planId });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    enterprise.plan = plan;

    await this.enterpriseRepository.save(enterprise);
  };
}
