import { Document } from 'mongoose';
import { LeanUser } from '../../user/user.interface';

export interface WalletDocument extends Document {
  userId: string | LeanUser;
  balance: number;
  totalMoneyReceived: number;
  totalMoneySent: number;
}

export type LeanWallet = Document<WalletDocument>;