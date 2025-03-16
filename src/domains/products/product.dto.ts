import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of Product (English)',
    example: 'Iphone En',
  })
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of Product (Vietnamese)',
    example: 'Iphone Vi',
  })
  @IsNotEmpty()
  @IsString()
  name_vi: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Price',
    example: 1000,
  })
  @IsNotEmpty()
  @IsNumber()
  price: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Category',
    example: 'Electronics',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Sub Category',
    example: 'Smart Phone',
  })
  @IsNotEmpty()
  @IsString()
  subcategory: string;
}

export class QueryProductDTO {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'Number of Page',
    example: 1,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Items per page',
    example: 10,
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  per_page: number;
}

export class SearchProductNameDTO extends QueryProductDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Search name',
    example: 'Iphone',
  })
  @IsString()
  @IsNotEmpty()
  q: string;
}

export class LikeProductDTO {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
