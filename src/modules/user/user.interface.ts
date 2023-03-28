import { HydratedDocument, Document } from 'mongoose';
import { User } from './schemas/user.schema';

export type UserDocument = HydratedDocument<User>;

export type LeanUser = Document<UserDocument>;

export interface UserFiles {
    profilePicture: Express.Multer.File[];
}
