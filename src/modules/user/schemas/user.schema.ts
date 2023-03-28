import { GenderEnum } from '../../../common/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { CallbackWithoutResultAndOptionalError } from 'mongoose';

import * as bcrypt from 'bcrypt'

@Schema()
export class User {
  @Prop({
    trim: true,
    required: true,
  })
  fullName: string;

  @Prop({
    trim: true,
    required: true,
    unique: true,
    email: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    select: false,
  })
  password?: string;

  @Prop()
  phoneNumber?: string;

  @Prop({
    enum: [GenderEnum.MALE, GenderEnum.FEMALE],
    uppercase: true,
  })
  gender?: GenderEnum;

  @Prop()
  dateOfBirth: string;

  @Prop()
  address: string;

  @Prop()
  occupation: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    required: false,
  })
  activeLoan: Array<string>;

  @Prop({
    default: 'https://conferenceoeh.com/wp-content/uploads/profile-pic-dummy.png'
  })
  profileImage: string;

  @Prop({
    default: 0
  })
  activeLoanAmount: number;

  @Prop({
    default: 0
  })
  activeLoanDuration: number;

  @Prop({
    default: 0
  })
  activeLoanBalance: number;

}

export const UserSchema = SchemaFactory.createForClass(User);


UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.isModified('password')) {
      const saltOrRounds = 10;
      const passwordHash = await bcrypt.hash(this.password, saltOrRounds);
      this.password = passwordHash;
    }
    return next();
  },
);