import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ERROR_CONSTANT, PRODUCT_CONSTANTS } from 'src/constants';
import { throwErrorMessage } from 'src/exception';
import { getSkipLimit } from 'src/helpers';
import {
  CachedProducts,
  Product,
  User,
} from 'src/infrastructures/mongodb/models';
import {
  CreateProductDTO,
  QueryProductDTO,
  SearchProductNameDTO,
} from './product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
  private logger = new Logger(this.constructor.name);
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  public async create(dto: CreateProductDTO): Promise<Product> {
    const product = await this.productModel.create(dto);
    await this.deleteCachedProducts();
    return product;
  }

  public async getProducts(
    query: QueryProductDTO,
  ): Promise<{ data: Product[]; total: number }> {
    const { page, per_page } = query;
    const cachedProducts = await this.getCachedProducts(page, per_page);
    if (cachedProducts)
      return {
        data: cachedProducts.products,
        total: cachedProducts.total,
      };
    this.logger.log('QUERY DB');
    const { skip, limit } = getSkipLimit(query);
    const [data, total] = await Promise.all([
      this.productModel.find({}, {}, { skip, limit, lean: true }),
      this.productModel.countDocuments(),
    ]);
    await this.cachingByPagination(data, total, page, per_page);
    return { data, total };
  }

  public async searchByName(
    query: SearchProductNameDTO,
    language: string,
  ): Promise<{ data: Product[]; total: number }> {
    const { skip, limit } = getSkipLimit(query);
    const searchField = language === 'vi' ? 'name_vi' : 'name_en';
    const [data, total] = await Promise.all([
      this.productModel.find(
        {
          [searchField]: { $regex: query.q, $options: 'i' },
        },
        {},
        { skip, limit, lean: true },
      ),
      this.productModel.countDocuments({
        [searchField]: { $regex: query.q, $options: 'i' },
      }),
    ]);
    return { data, total };
  }

  public async toggleLike(id: string, user: User): Promise<Product> {
    const product = await this.assertProduct(id);
    const liked_by: string[] = product.liked_by;
    const index = liked_by.indexOf(user._id);
    if (index === -1) {
      liked_by.push(user._id);
    } else {
      liked_by.splice(index, 1);
    }
    await this.productModel.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { liked_by },
    );
    await this.deleteCachedProducts();
    return this.assertProduct(id);
  }

  private async assertProduct(id: string): Promise<Product> {
    const product = await this.productModel.findById(id, {}, { lean: true });
    if (!product) throwErrorMessage({ code: ERROR_CONSTANT.PRODUCT_NOT_FOUND });
    return product as Product;
  }

  private async cachingByPagination(
    products: Product[],
    total: number,
    page: number,
    per_page: number,
  ): Promise<void> {
    const key = PRODUCT_CONSTANTS.CACHING_PAGINATION(page, per_page);
    this.logger.log(`SET KEY: ${key}`);
    await this.cache.set<CachedProducts>(
      key,
      { products, total },
      PRODUCT_CONSTANTS.CACHING_PAGINATION_SECONDS * 1000,
    );
  }

  private async getCachedProducts(
    page: number,
    per_page: number,
  ): Promise<CachedProducts> {
    const key = PRODUCT_CONSTANTS.CACHING_PAGINATION(page, per_page);
    this.logger.log(`GET KEY: ${key}`);
    const cachedProducts = await this.cache.get<CachedProducts>(key);
    if (!cachedProducts) return null as unknown as CachedProducts;
    return cachedProducts as CachedProducts;
  }

  private async deleteCachedProducts() {
    const map: Map<string, string> = this.cache.stores[0].store;
    if (!map) return;

    const productKeys: string[] = [];
    for (const key of map.keys()) {
      if (key.includes(PRODUCT_CONSTANTS.PRODUCTS_PATTERN)) {
        const productKey = key.split('keyv:')[1];
        productKeys.push(productKey);
      }
    }
    if (!productKeys?.length) return;
    await this.cache.mdel(productKeys);
  }
}
