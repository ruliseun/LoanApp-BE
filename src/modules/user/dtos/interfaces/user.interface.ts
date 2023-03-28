import { Document } from 'mongoose';

export interface UserDocument extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth: string;
  address: string;
  occupation: string;
  profileImage: string;
  gender: string;
  activeLoan: Array<string>;
  activeLoanAmount: number;
  activeLoanDuration: number;
  activeLoanBalance: number;
}

export interface ReturnDataDocument {
  user: object;
  metadata: object;
}

export interface Filter{
  page: number
}

export type LeanUser = Document<UserDocument>;
