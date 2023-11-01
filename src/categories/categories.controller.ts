import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import CategoriesService from './categories.service';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import CreateCategoryDto from './dto/create-category.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';

@Controller('categories')
@UseFilters(TypeormExceptionFilter)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Auth()
  public listCategories(
    @Query() dto: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.categoriesService.listCategories(dto, enterprise);
  }

  @Post()
  @Auth(UserRoles.OWNER)
  public createCategory(
    @Body() dto: CreateCategoryDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.categoriesService.createCategory(dto, enterprise);
  }
}
