import { Injectable, NotFoundException } from '@nestjs/common';
import CreateCategoryDto from './dto/create-category.dto';
import UpdateCategoryDto from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Category from './entities/category.entity';
import { DataSource, Repository } from 'typeorm';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Subcategory from './entities/subcategory.entity';
import ErrorDatabaseService from '../common/service/error.database.service';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { CRUD } from '../common/constants/messages.error.constant';

@Injectable()
export default class CategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
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
    { subcategories, ...resData }: CreateCategoryDto,
    enterprise: Enterprise,
  ) => {
    const category = this.categoryRepository.create({ ...resData, enterprise });
    const subs: Subcategory[] = [];
    for (const subcategory of subcategories) {
      subs.push(await this.subcategoryRepository.create({ name: subcategory }));
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const catSaved = await queryRunner.manager.save<Category>(category);
      const subCatsForSave = subs.map((sub) => ({
        ...sub,
        category: catSaved,
      }));

      const subSaved = await queryRunner.manager.save(
        Subcategory,
        subCatsForSave,
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();
      delete catSaved.enterprise;
      return { ...catSaved, subcategories: subSaved.map((cat) => cat.name) };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public updateCategory = async (
    id: string,
    { subcategories, ...resData }: UpdateCategoryDto,
  ) => {
    const category = await this.categoryRepository.preload({ id, ...resData });
    if (!category) throw new NotFoundException(CRUD.NOT_FOUND);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const catSaved = await queryRunner.manager.save<Category>(category);
      if (subcategories) {
        await queryRunner.manager.delete(Subcategory, {
          category: { id },
        });

        const subs = subcategories.map((subcategory) =>
          this.subcategoryRepository.create({
            name: subcategory,
            category: catSaved,
          }),
        );

        await queryRunner.manager.save(Subcategory, subs);

        await queryRunner.commitTransaction();
        await queryRunner.release();
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }
  };

  public findCategoryById = (id: string) =>
    this.categoryRepository.findOne({
      where: { id },
      relations: ['subcategories'],
    });
}
