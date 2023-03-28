import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbSchemas } from '../../common/constants';
import { UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { WalletSchema } from '../wallet/schema/wallet.schema';
import { WalletModule } from '../wallet/wallet.module';
import { LoanController } from './loan.controller';
import { LoanSchema } from './schemas/loan.schema';
import { LoanPlanSchema } from './schemas/loanPlan.schema';
import { LoanService } from './services/loan.service';

@Module({
    imports: [
      UserModule,
      MongooseModule.forFeature([
        {
          name: DbSchemas.loan,
          schema: LoanSchema,
        },
        {
          name: DbSchemas.loanplan,
          schema: LoanPlanSchema,
        },
        {
          name: DbSchemas.user,
          schema: UserSchema,
        },
        {
          name: DbSchemas.wallet,
          schema: WalletSchema,
        },
      ]),
      forwardRef(() => WalletModule)
    ],
    controllers: [LoanController],
    providers: [
        LoanService,
    ],
    exports: [
        LoanService
    ],
})
export class LoanModule {}
