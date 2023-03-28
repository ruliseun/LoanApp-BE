import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/validations';
import { UserModule } from './modules/user/user.module';
import { MongoDbProviderModule } from './common/providers/database/mongo/mongodb.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { LoanController } from './modules/loan/loan.controller';
import { LoanModule } from './modules/loan/loan.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    UserModule,
    MongoDbProviderModule,
    AuthModule,
    CloudinaryModule,
    LoanModule,
    WalletModule
  ],
  controllers: [AppController, LoanController],
  providers: [
    AppService, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
