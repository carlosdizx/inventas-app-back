import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { Repository } from 'typeorm';
import CreateProductDto from './dto/create-product.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';
import CategoriesService from '../categories/categories.service';
import ErrorDatabaseService from '../common/service/error.database.service';
import Category from '../categories/entities/category.entity';
import Subcategory from '../categories/entities/subcategory.entity';

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private categoriesService: CategoriesService,
  ) {}

  public createProduct = async (
    { category, subcategory, ...resData }: CreateProductDto,
    enterprise: Enterprise,
  ) => {
    let categoryFound: Category = null;
    let subcategoryFound: Subcategory = null;
    if (category) {
      categoryFound = await this.categoriesService.findCategoryById(category);
      if (!categoryFound)
        throw new NotFoundException('Categoría del producto es inexistente');
      if (subcategory) {
        subcategoryFound = categoryFound.subcategories.find(
          (sb) => sb.id === subcategory,
        );
        if (!subcategoryFound)
          throw new NotFoundException(
            'Subcategoría del producto es inexistente',
          );
      }
    }
    const product = this.productRepository.create({
      ...resData,
      category: categoryFound,
      subcategory: subcategoryFound,
      enterprise,
    });

    return await this.productRepository.save(product);
  };
}
