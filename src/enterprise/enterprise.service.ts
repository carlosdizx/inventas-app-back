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
import User from '../users/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import ChangeStatusDto from '../common/dto/change-status.dto';
import PlanService from './plan.service';
import UserDetails from '../users/entities/user.details.entity';
import { UserRoles } from '../users/enums/user.roles.enum';
import generatePasswordUtil from '../common/util/generate.password.util';
import EncryptService from '../common/service/encrypt.service';
import { hashPassword } from '../common/util/encrypt.util';
import registerActiveEnterpriseEmail from '../common/templates/mails/register-active-enterprise.email';
import NodemailerService from '../common/service/nodemailer.service';
import { ConfigService } from '@nestjs/config';
import { CRUD, ENTERPRISE } from '../common/constants/messages.constant';
import SendEmailDto from '../common/dto/send.email.dto';
import registerPendingEnterpriseEmail from '../common/templates/mails/register-pending-enterprise.email';
import enterpriseReactivatedEmail from '../common/templates/mails/enterprise-reactived.email';
import enterpriseInactiveEmail from '../common/templates/mails/enterprise-inactive.email';

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

  public createEnterpriseAndUser = async (
    {
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
    }: CreateEnterpriseDTO,
    isPublic: boolean,
  ) => {
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
        status: isPublic ? StatusEntity.PENDING_APPROVAL : StatusEntity.ACTIVE,
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

      userSaved.enterprise =
        await queryRunner.manager.save<Enterprise>(enterprise);
      this.logger.debug('Enterprise Saved');

      await queryRunner.manager.save<User>(userSaved);
      const dtoEmail: SendEmailDto = {
        from: 'Registro exitoso <noreply_inventa@gmail.com>',
        to: email,
        subject: `Registro en Inventas-App ${email}`,
        html: '',
      };
      if (isPublic) {
        dtoEmail.html = registerPendingEnterpriseEmail(password, this.urlApp);
        await this.nodemailerService.main(dtoEmail);
      } else {
        dtoEmail.html = registerActiveEnterpriseEmail(password, this.urlApp);
        await this.nodemailerService.main(dtoEmail);
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        title: `Empresa registrada con éxito`,
        message:
          'La empresa ha sido registrada exitosamente.<br/>' +
          ' Se ha enviado un correo electrónico con la contraseña de acceso a la plataforma. <br>' +
          `${
            isPublic
              ? 'Tu cuenta esta temporalmente esta en revisión, no podrás usarla hasta que alguien' +
                'de nuestro equipo valide tu información.'
              : ''
          }`,
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

    const result = await this.enterpriseRepository.save(enterprise);

    const isActiveCase = enterprise.status === StatusEntity.ACTIVE;
    const subject = isActiveCase
      ? `Tu empresa ya está nuevamente activa ${enterprise.email}`
      : `Tu empresa ha sido temporalmente suspendida ${enterprise.email}`;

    const dtoEmail: SendEmailDto = {
      from: 'Notificaciones <noreply_inventa@gmail.com>',
      to: enterprise.email,
      subject,
      html: '',
    };

    if (isActiveCase) {
      dtoEmail.html = enterpriseReactivatedEmail(this.urlApp);
      await this.nodemailerService.main(dtoEmail);
    } else {
      dtoEmail.html = enterpriseInactiveEmail();
      await this.nodemailerService.main(dtoEmail);
    }

    return result;
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
