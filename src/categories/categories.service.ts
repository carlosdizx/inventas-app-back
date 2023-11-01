import { Injectable } from '@nestjs/common';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Category from './entities/category.entity';
import { Repository } from 'typeorm';
import PaginationDto from '../common/dto/pagination.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';

@Injectable()
export default class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  public listCategories = async (
    { offset, limit }: PaginationDto,
    enterprise: Enterprise,
  ) => {
    return await this.categoryRepository.find({
      where: { enterprise: { id: enterprise.id } },
      select: ['id', 'name', 'description', 'subcategories'],
      skip: offset,
      take: limit,
    });
  };

  public createCategory = async (
    dto: CreateCategoryDto,
    enterprise: Enterprise,
  ) => {
    const category = this.categoryRepository.create({ ...dto, enterprise });
    await this.categoryRepository.save(category);
  };
}
