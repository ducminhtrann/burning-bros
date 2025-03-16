import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PRODUCT_CONSTANTS } from 'src/constants';
import { BaseSchema } from './base';
import { ApiProperty } from '@nestjs/swagger';

@BaseSchema(PRODUCT_CONSTANTS.MODEL_NAME)
export class Product extends Document {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of Product (English)',
    example: 'Iphone En',
  })
  @Prop({ required: true })
  name_vi: string;

  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subcategory: string;

  @Prop({ type: [String], default: [] })
  liked_by: string[];

  likes?: number;

  name?: string;

  constructor(data?: Partial<Product>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export class CachedProducts {
  products: Product[];
  total: number;
}
