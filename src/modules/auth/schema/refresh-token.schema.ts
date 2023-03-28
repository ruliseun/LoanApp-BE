import { Schema } from 'mongoose';
import { DbSchemas } from '../../../common/constants';

export const RefreshTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: DbSchemas.user,
    required: true,
  },
  isRevoked: {
    type: Boolean,
    required: true,
    default: false,
  },
  userAgent: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});