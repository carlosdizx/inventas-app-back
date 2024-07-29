import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import CategoriesService from './categories.service';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../users/decorators/auth.decorator';
import { UserRoles } from '../users/enums/user.roles.enum';
import CreateCategoryDto from './dto/create-category.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import UpdateCategoryDto from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
@UseFilters(TypeormExceptionFilter)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Auth()
  public listCategories(
    @Query() { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.categoriesService.listCategories({ page, limit }, enterprise);
  }

  @Post()
  @Auth(UserRoles.OWNER, UserRoles.ADMIN, UserRoles.CASHIER)
  public async createCategory(
    @Body() dto: CreateCategoryDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.categoriesService.createCategory(dto, enterprise);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN, UserRoles.CASHIER)
  public async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(id, dto);
  }

  @Get(':id')
  @Auth()
  public async findCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.findCategoryById(id);
  }
}
