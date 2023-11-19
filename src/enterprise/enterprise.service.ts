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
import NodemailerService from '../common/service/nodemailer.service';
import registerEnterpriseMail from '../common/templates/mails/register.enterprise.mail';
import generatePasswordUtil from '../common/util/generate.password.util';

@Injectable()
export default class EnterpriseService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Enterprise)
    private readonly enterpriseRepository: Repository<Enterprise>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly userCrudService: UserCrudService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  public createEnterpriseAndUser = async ({
    user,
    ...resDataEnterprise
  }: CreateEnterpriseDTO) => {
    const enterprise = this.enterpriseRepository.create({
      ...resDataEnterprise,
      status: StatusEntity.ACTIVE,
    });

    user.password = generatePasswordUtil(20);

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

      await this.nodemailerService.main({
        from: 'Registro exitoso <noreply_inventa@gmail.com>',
        to: user.email,
        subject: 'Registro en Inventas-App',
        html: registerEnterpriseMail(user.password),
      });
    } catch (error) {
      await this.userCrudService.deleteUserById(userSaved.user.id);
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };
}
