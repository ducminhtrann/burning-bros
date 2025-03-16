import { Schema } from '@nestjs/mongoose';
import { SchemaOptions } from 'mongoose';
import { Prop } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

export const BaseSchema = (collection: string, options: SchemaOptions = {}) => {
  options['collection'] = collection;
  options['timestamps'] = true;
  options['autoIndex'] = true;
  options['versionKey'] = false;
  return Schema(options);
};

export class BaseModel {
  _id: string;

  @Prop({ type: SchemaTypes.Date })
  created_at: Date;

  @Prop({ type: SchemaTypes.Date })
  updated_at: Date;

  constructor(data?: Partial<BaseModel>) {
    this._id = data?._id || '';
    this.created_at = data?.created_at || new Date();
    this.updated_at = data?.updated_at || new Date();
  }
}
