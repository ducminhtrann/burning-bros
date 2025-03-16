import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard, AuthUser, Language } from '../auth';
import {
  CreateProductDTO,
  LikeProductDTO,
  QueryProductDTO,
  SearchProductNameDTO,
} from './product.dto';
import { ProductService } from './product.service';
import { Product, User } from 'src/infrastructures/mongodb/models';
import { LANGUAGE } from 'src/constants';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create product' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  public async createProduct(
    @Body() body: CreateProductDTO,
    @Res() res: Response,
  ) {
    const product = await this.productService.create(body);
    res.status(HttpStatus.CREATED).send({ data: product });
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like/Dislike product' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @ApiHeader({
    name: 'accept-language',
    description: 'Language (Vi|En)',
    enum: LANGUAGE,
    example: LANGUAGE.EN,
    required: true,
  })
  @UseGuards(AuthGuard)
  public async toggleLike(
    @AuthUser() user: User,
    @Param() params: LikeProductDTO,
    @Res() res: Response,
    @Language() language: string,
  ) {
    const product = await this.productService.toggleLike(params.id, user);
    res.status(HttpStatus.OK).send({
      data: this.translateProduct(product, language),
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get products with pagination' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Language (Vi|En)',
    enum: LANGUAGE,
    example: LANGUAGE.EN,
    required: true,
  })
  public async getProducts(
    @Query() query: QueryProductDTO,
    @Res() res: Response,
    @Language() language: string,
  ) {
    const { data, total } = await this.productService.getProducts(query);
    const products = data.map((e) => this.translateProduct(e, language));
    res.status(HttpStatus.OK).send({
      data: products,
      total,
      page: query.page,
      per_page: query.per_page,
    });
  }

  @Get('search')
  @ApiOperation({ summary: 'Search name of products with pagination' })
  @ApiOperation({ summary: 'Get products with pagination' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Language (Vi|En)',
    enum: LANGUAGE,
    example: LANGUAGE.EN,
    required: true,
  })
  public async searchByName(
    @Query() query: SearchProductNameDTO,
    @Res() res: Response,
    @Language() language: string,
  ) {
    const { data, total } = await this.productService.searchByName(
      query,
      language,
    );
    const products = data.map((e) => this.translateProduct(e, language));
    res.status(HttpStatus.OK).send({
      data: products,
      total,
      page: query.page,
      per_page: query.per_page,
    });
  }

  private translateProduct(
    product: Product,
    language: string,
  ): Partial<Product> {
    const { name_en, name_vi, liked_by = [], ...rest } = product;

    const likes = liked_by.length;
    if (language === 'en') {
      return {
        ...rest,
        name: name_en,
        likes,
      };
    }
    return {
      ...rest,
      name: name_vi,
      likes,
    };
  }
}
