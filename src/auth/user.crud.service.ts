import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import EncryptService from '../common/service/encrypt.service';
import CreateUserDto from './dto/create-user.dto';
import { hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import UserDetails from './entities/user.details.entity';
import Enterprise from '../enterprise/entities/enterprise.entity';
import UpdateUserDto from './dto/update-user.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import generatePasswordUtil from '../common/util/generate.password.util';
import registerEnterpriseMail from '../common/templates/mails/register.enterprise.mail';
import NodemailerService from '../common/service/nodemailer.service';
import { UserRoles } from './enums/user.roles.enum';

@Injectable()
export default class UserCrudService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
    private readonly nodemailerService: NodemailerService,
  ) {}

  public createUser = async (
    {
      email,
      roles = [UserRoles.OWNER],
      firstName,
      lastName,
      documentType,
      documentNumber,
      gender,
      birthdate,
      phone,
    }: CreateUserDto,
    enterprise: Enterprise = null,
  ) => {
    const password = generatePasswordUtil(20);
    const newUser = this.userRepository.create({
      email,
      password: this.encryptService.encrypt(await hashPassword(password)),
      roles,
      status: StatusEntity.ACTIVE,
    });

    const details = this.userDetailsRepository.create({
      firstName,
      lastName,
      documentType,
      documentNumber,
      gender,
      birthdate,
      phone,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      if (enterprise) newUser.enterprise = enterprise;
      details.user = await queryRunner.manager.save<User>(newUser);
      await queryRunner.manager.save<UserDetails>(details);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      delete details.user.password;

      await this.nodemailerService.main({
        from: 'Registro exitoso <noreply_inventa@gmail.com>',
        to: email,
        subject: 'Registro en Inventas-App',
        html: registerEnterpriseMail(password),
      });
      return details;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public findUserById = async (id: string) => {
    const userFound = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userDetails', 'details')
      .where('user.id = :id', { id })
      .getOne();
    if (!userFound) throw new NotFoundException('Usuario no encontrado');
    const { userDetails, ...restData } = userFound;
    return { ...restData, ...userDetails, id };
  };

  public deleteUserById = async (id: string) => {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
    return { message: `User was removed` };
  };

  public updateStatusAndRolesById = async (id: string, dto: UpdateUserDto) => {
    const userPreload = await this.userRepository.preload({ id, ...dto });
    if (!userPreload) throw new NotFoundException('Usuario no encontrado');

    await this.userRepository.save(userPreload);
  };

  public listUsers = async (
    { page, limit }: IPaginationOptions,
    enterprise: Enterprise,
    user: User,
  ) => {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userDetails', 'details')
      .where('user.enterprise.id = :enterpriseId', {
        enterpriseId: enterprise.id,
      })
      .andWhere('user.id != :userId', { userId: user.id });
    const data = await paginate<User>(queryBuilder, {
      page,
      limit,
      route: 'users',
    });
    const itemMapped = data.items.map(({ id, userDetails, ...restData }) => ({
      ...restData,
      ...userDetails,
      id,
    }));

    return { ...data, items: itemMapped };
  };
}
