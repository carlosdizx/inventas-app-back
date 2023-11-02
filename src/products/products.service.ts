import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { Repository } from 'typeorm';
import CreateProductDto from './dto/create-product.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';
import CategoriesService from '../categories/categories.service';
import ErrorDatabaseService from '../common/service/error.database.service';

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private categoriesService: CategoriesService,
  ) {}

  public createProduct = async (
    { category, ...resData }: CreateProductDto,
    enterprise: Enterprise,
  ) => {
    const categoryFound = await this.categoriesService.findCategoryById(
      category,
    );
    if (!categoryFound)
      throw new NotFoundException('Categoría del producto inexistente');
    const product = this.productRepository.create({
      ...resData,
      category: categoryFound,
      enterprise,
    });

    return await this.productRepository.save(product);
  };
}
