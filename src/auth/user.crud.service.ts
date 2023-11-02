import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource, Not, Repository } from 'typeorm';
import ErrorDatabaseService from '../common/service/error.database.service';
import EncryptService from '../common/service/encrypt.service';
import CreateUserDto from './dto/create-user.dto';
import { hashPassword } from '../common/util/encrypt.util';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import UserDetails from './entities/user.details.entity';
import Enterprise from '../enterprise/entities/enterprise.entity';
import UpdateUserDto from './dto/update-user.dto';
import PaginationDto from '../common/dto/pagination.dto';

@Injectable()
export default class UserCrudService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserDetails)
    private readonly userDetailsRepository: Repository<UserDetails>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly encryptService: EncryptService,
  ) {}

  public createUser = async (
    {
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
    }: CreateUserDto,
    enterprise: Enterprise = null,
  ) => {
    const newUser = this.userRepository.create({
      email: email,
      password: this.encryptService.encrypt(await hashPassword(password)),
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
      if (enterprise) newUser.enterprise = enterprise;
      details.user = await queryRunner.manager.save<User>(newUser);
      await queryRunner.manager.save<UserDetails>(details);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      delete details.user.password;
      return details;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public findUserById = async (id: string) =>
    await this.userRepository.findOneBy({ id });

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

  public listUser = async (
    { page, limit }: PaginationDto,
    enterprise: Enterprise,
    user: User,
  ) => {
    return await this.userRepository.find({
      where: { enterprise: { id: enterprise.id }, id: Not(user.id) },
      skip: page,
      take: limit,
    });
  };
}
