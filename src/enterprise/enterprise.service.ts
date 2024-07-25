import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Enterprise from './entities/enterprise.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import ErrorDatabaseService from '../common/service/error.database.service';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import User from '../auth/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import ChangeStatusDto from '../common/dto/change-status.dto';
import PlanService from './plan.service';
import UserDetails from '../auth/entities/user.details.entity';
import { UserRoles } from '../auth/enums/user.roles.enum';
import generatePasswordUtil from '../common/util/generate.password.util';
import EncryptService from '../common/service/encrypt.service';
import { hashPassword } from '../common/util/encrypt.util';
import registerEnterpriseMail from '../common/templates/mails/register.enterprise.mail';
import NodemailerService from '../common/service/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { CRUD, ENTERPRISE } from '../common/constants/messages.constant';

@Injectable()
export default class EnterpriseService {
  private readonly logger = new Logger(EnterpriseService.name);

  private readonly urlApp: string;

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly planService: PlanService,
    private readonly nodemailerService: NodemailerService,
    private readonly configService: ConfigService,
  ) {
    this.urlApp = this.configService.get('APP_CLIENT_URL');
  }

  public createEnterpriseAndUser = async ({
    user: {
      email,
      firstName,
      lastName,
      documentType,
      documentNumber,
      gender,
      birthdate,
      phone,
    },
    planId,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    if (planId) {
      const plan = await this.planService.findOneBy({ id: planId });
      if (!plan) throw new NotFoundException(ENTERPRISE.PLAN_NOT_FOUND);
      resDataEnterprise['plan'] = plan;
    }

    this.logger.debug('Trying to create enterprise...');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const enterprise = this.enterpriseRepository.create({
        ...resDataEnterprise,
        status: StatusEntity.ACTIVE,
      });

      const password = generatePasswordUtil(20);

      let userSaved = this.userRepository.create({
        email: email,
        roles: [UserRoles.OWNER],
        password: this.encryptService.encrypt(await hashPassword(password)),
        status: StatusEntity.ACTIVE,
      });

      const userDetails = this.userDetailsRepository.create({
        firstName,
        lastName,
        documentType,
        documentNumber,
        gender,
        birthdate,
        phone,
      });

      userSaved = await queryRunner.manager.save<User>(userSaved);
      this.logger.debug('User Saved');
      userDetails.user = userSaved;
      enterprise.owner = userDetails.user;

      await queryRunner.manager.save<UserDetails>(userDetails);
      this.logger.debug('User Details Saved');

      userSaved.enterprise = await queryRunner.manager.save<Enterprise>(
        enterprise,
      );
      this.logger.debug('Enterprise Saved');

      await queryRunner.manager.save<User>(userSaved);

      await this.nodemailerService.main({
        from: 'Registro exitoso <noreply_inventa@gmail.com>',
        to: email,
        subject: 'Registro en Inventas-App',
        html: registerEnterpriseMail(password, this.urlApp),
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        title: `Empresa registrada con éxito`,
        message:
          'La empresa ha sido registrada exitosamente.<br/>' +
          ' Se ha enviado un correo electrónico con la contraseña de acceso a la plataforma.',
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

    if (!enterprise) throw new NotFoundException(ENTERPRISE.NOT_FOUND);

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
    if (!enterprise) throw new NotFoundException(ENTERPRISE.NOT_FOUND);

    if (
      (enterprise.status === StatusEntity.ACTIVE ||
        enterprise.status === StatusEntity.INACTIVE) &&
      (status === StatusEntity.PENDING_CONFIRMATION ||
        status === StatusEntity.PENDING_APPROVAL)
    )
      throw new ConflictException(CRUD.CONFLICT);

    enterprise.status = status;

    return await this.enterpriseRepository.save(enterprise);
  };

  public changePlanEnterprise = async (id: string, planId: string) => {
    const enterprise = await this.findOneBy({ id });
    if (!enterprise) throw new NotFoundException(ENTERPRISE.NOT_FOUND);

    const plan = await this.planService.findOneBy({ id: planId });
    if (!plan) throw new NotFoundException(ENTERPRISE.PLAN_NOT_FOUND);

    enterprise.plan = plan;

    await this.enterpriseRepository.save(enterprise);
  };
}
