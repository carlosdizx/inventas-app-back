import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import CreateUserDto from './dto/create-user.dto';
import UserCrudService from './user.crud.service';
import UpdateUserDto from './dto/update-user.dto';
import getDataReq from './decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from './decorators/auth.decorator';
import { UserRoles } from './enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';
import User from './entities/user.entity';
import EnterpriseService from '../enterprise/enterprise.service';
import OtpGuardGuard from '../common/guards/otp.guard.guard';

@Controller('users')
@UseFilters(TypeormExceptionFilter)
export default class UserCrudController {
  constructor(
    private readonly userCrudService: UserCrudService,
    private readonly enterpriseService: EnterpriseService,
  ) {}
  @Post()
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(OtpGuardGuard)
  public async create(
    @Body() dto: CreateUserDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    const isSuper = dto.roles.includes(UserRoles.SUPER_ADMIN);
    const isOwner = dto.roles.includes(UserRoles.OWNER);
    if (isSuper || isOwner)
      throw new BadRequestException('Roles no permitidos');

    const { plan } = await this.enterpriseService.findEnterpriseAndOwnerById(
      enterprise.id,
    );
    enterprise.plan = plan;
    return await this.userCrudService.createUser(dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  public async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userCrudService.findUserById(id);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  @UseGuards(OtpGuardGuard)
  public async changeStatusAndRoles(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.userCrudService.updateStatusAndRolesById(id, dto);
  }

  @Get()
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  public async listUsers(
    @Body() { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
    @getDataReq(true) user: User,
  ) {
    return await this.userCrudService.listUsers(
      { page, limit },
      enterprise,
      user,
    );
  }
}
