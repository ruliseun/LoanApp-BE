import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { DbSchemas } from '../../common/constants';
import { LoanModule } from '../loan/loan.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { RefreshTokenSchema } from './schema/refresh-token.schema';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    LoanModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');

        return {
          secret,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: DbSchemas.refresh_token,
        schema: RefreshTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    TokenService,
  ],
  exports: [TokenService, AuthService],
})
export class AuthModule {}