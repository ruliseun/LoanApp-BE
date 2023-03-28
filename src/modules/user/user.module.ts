import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbSchemas } from '../../common/constants';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { WalletModule } from '../wallet/wallet.module';
import { UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: DbSchemas.user, schema: UserSchema }]),
        CloudinaryModule,
        forwardRef(() => WalletModule)
      ],
      controllers: [UserController],
      providers: [UserService],
      exports: [UserService],
})
export class UserModule {}
