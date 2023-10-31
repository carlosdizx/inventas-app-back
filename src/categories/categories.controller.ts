import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import CategoriesService from './categories.service';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../auth/decorators/auth.decorator';

@Controller('categories')
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
}
