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
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import CreateCategoryDto from './dto/create-category.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import UpdateCategoryDto from './dto/update-category.dto';

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
  public async createCategory(
    @Body() dto: CreateCategoryDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.categoriesService.createCategory(dto, enterprise);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER)
  public async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(id, dto);
  }

  @Get(':id')
  public async findCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.categoriesService.findCategoryById(id);
  }
}
