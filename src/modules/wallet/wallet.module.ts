import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbSchemas } from '../../common/constants';
import { WalletSchema } from './schema/wallet.schema';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DbSchemas.wallet,
        schema: WalletSchema,
      }
    ])
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
