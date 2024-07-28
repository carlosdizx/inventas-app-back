import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { In, Repository } from 'typeorm';
import CreateProductDto from './dto/create-product.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';
import CategoriesService from '../categories/categories.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import UpdateProductDto from './dto/update-product.dto';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import ProductQuantityDto from '../sales/dto/product-quantity.dto';
import { CRUD } from '../common/constants/messages.constant';

@Injectable()
export default class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private categoriesService: CategoriesService,
  ) {}

  public createProduct = async (
    { category, subcategory, ...resData }: CreateProductDto,
    enterprise: Enterprise,
  ) => {
    const product = this.productRepository.create({
      ...resData,
      enterprise,
    });

    if (category) {
      product.category =
        await this.categoriesService.findCategoryById(category);
      if (
        product.category === null ||
        product.category.status === StatusEntity.INACTIVE
      )
        throw new NotFoundException(CRUD.NOT_FOUND);
      if (subcategory) {
        product.subcategory = product.category.subcategories.find(
          (sb) => sb.id === subcategory,
        );
        if (!product.subcategory) throw new NotFoundException(CRUD.NOT_FOUND);
      }
    }

    return await this.productRepository.save(product);
  };

  public listProducts = async (
    { page, limit }: IPaginationOptions,
    enterprise: Enterprise,
  ) => {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .where('product.enterprise.id = :id', { id: enterprise.id });
    return await paginate<Product>(queryBuilder, {
      page,
      limit,
      route: 'products',
    });
  };

  public updateProductById = async (
    id: string,
    { category, subcategory, ...resData }: UpdateProductDto,
  ) => {
    const productFound = await this.productRepository.preload({
      id,
      ...resData,
    });
    if (!productFound) throw new NotFoundException(CRUD.NOT_FOUND);

    if (category) {
      productFound.category =
        await this.categoriesService.findCategoryById(category);
      if (
        productFound.category === null ||
        productFound.category.status === StatusEntity.INACTIVE
      )
        throw new NotFoundException(CRUD.NOT_FOUND);
      if (subcategory) {
        productFound.subcategory = productFound.category.subcategories.find(
          (sb) => sb.id === subcategory,
        );
        if (!productFound.subcategory)
          throw new NotFoundException(CRUD.NOT_FOUND);
      }
    }

    return this.productRepository.save(productFound);
  };

  public findProductById = async (id: string, enterprise: Enterprise) => {
    const product = await this.productRepository.findOne({
      where: { enterprise: { id: enterprise.id }, id },
      relations: ['category', 'subcategory'],
    });

    if (product)
      return {
        ...product,
        costPrice: +product.costPrice,
        salePrice: +product.salePrice,
      };
    throw new NotFoundException(CRUD.NOT_FOUND);
  };

  public findProductsMappedByIdsAndEnterprise = async (
    productQuantities: ProductQuantityDto[],
    enterprise: Enterprise,
  ) => {
    const products = await this.productRepository.find({
      where: {
        id: In(productQuantities.map(({ id }) => id)),
        enterprise: { id: enterprise.id },
      },
    });

    if (products.length !== productQuantities.length)
      throw new ConflictException(CRUD.CONFLICT);

    return products.map(({ id, salePrice, name }) => {
      const { quantity } = productQuantities.find(
        (product) => product.id === id,
      );
      return {
        id,
        name,
        salePrice,
        quantity,
        subtotal: salePrice * quantity,
      };
    });
  };

  public findAllProducts = async ({ id }: Enterprise) =>
    await this.productRepository.find({
      where: {
        enterprise: { id },
        status: StatusEntity.ACTIVE,
        requiresInventory: true,
      },
    });

  public findProductsNotRequiereInventory = async ({ id }: Enterprise) => {
    return await this.productRepository.find({
      where: {
        enterprise: { id },
        status: StatusEntity.ACTIVE,
        requiresInventory: false,
      },
    });
  };
}
