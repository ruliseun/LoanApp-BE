import { Schema } from 'mongoose';
import { DbSchemas } from '../../../common/constants';

export const WalletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: DbSchemas.user,
  },
  balance: {
    type: Number,
    default: 0,
  },
  totalMoneyReceived: {
    type: Number,
    default: 0,
  },
  totalMoneySent: {
    type: Number,
    default: 0,
  },
});
