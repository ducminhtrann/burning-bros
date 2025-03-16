import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel, BaseSchema } from './base';
import { USER_CONSTANTS } from 'src/constants';

@BaseSchema(USER_CONSTANTS.MODEL_NAME)
export class User extends BaseModel {
  @Prop({ type: String, required: true, lowercase: true })
  username: string;

  @Prop({ type: String })
  password: string;

  constructor(data?: Partial<User>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
