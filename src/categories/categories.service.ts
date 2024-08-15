import { Injectable, NotFoundException } from '@nestjs/common';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Category from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import Enterprise from '../enterprise/entities/enterprise.entity';
import ErrorDatabaseService from '../common/service/error.database.service';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CRUD } from '../common/constants/messages.constant';

@Injectable()
export default class CategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly errorDatabaseService: ErrorDatabaseService,
  ) {}

  public listCategories = async (
    { page, limit }: IPaginationOptions,
    { id }: Enterprise,
  ) => {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.enterprise.id = :id', { id });
    return await paginate<Category>(queryBuilder, {
      page,
      limit,
      route: 'categories',
    });
  };

  public createCategory = async (
    { ...resData }: CreateCategoryDto,
    enterprise: Enterprise,
  ) => {
    const category = this.categoryRepository.create({ ...resData, enterprise });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const catSaved = await queryRunner.manager.save<Category>(category);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      delete catSaved.enterprise;
      return { ...catSaved };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public updateCategory = async (
    id: string,
    { ...resData }: UpdateCategoryDto,
  ) => {
    const category = await this.categoryRepository.preload({ id, ...resData });
    if (!category) throw new NotFoundException(CRUD.NOT_FOUND);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save<Category>(category);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    } finally {
      await queryRunner.release();
    }
  };

  public findCategoryById = (id: string) =>
    this.categoryRepository.findOne({
      where: { id },
    });
}
