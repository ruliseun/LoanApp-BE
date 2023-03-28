import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { TokenExpiredError } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { DbSchemas, ErrorMessages } from '../../../common/constants';
import { UserDocument } from '../../user/user.interface';
import { RefreshTokenDocument } from '../interfaces/auth.interface';

@Injectable()
export class TokenService {
  private readonly baseOptions: JwtSignOptions = {
    issuer: 'localhost:4000'
  };

  constructor(
    @InjectModel(DbSchemas.refresh_token)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateRefreshToken(user: UserDocument, userAgent: string) {
    const expiresIn = +this.configService.get<string>('JWT_REFRESH_TOKEN_TTL');

    const expires = new Date();
    expires.setTime(expires.getTime() + expiresIn * 1000);

    const createdRefreshToken = await this.refreshTokenModel.create({
      userId: user._id,
      userAgent,
      expires,
    });

    const payload = {
      sub: user._id,
      jwtid: createdRefreshToken.id,
    };

    return this.jwtService.signAsync(payload, {
      ...this.baseOptions,
      expiresIn,
    });
  }

  async decodeRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync(refreshToken);
    } catch (error) {
      console.log('Error: ===>', error)
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException(
          ErrorMessages.EXPIRED_REFRESH_TOKEN,
        );
      }

      throw new UnprocessableEntityException(
        ErrorMessages.INVALID_REFRESH_TOKEN,
      );
    }
  }

  async generateAccessToken(userId: string, jwtid: string) {
    const expiresIn = +this.configService.get<string>('JWT_ACCESS_TOKEN_TTL');

    const payload = {
      sub: userId,
      jwtid,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      ...this.baseOptions,
      expiresIn,
    });

    return { accessToken, expiresIn: expiresIn * 1000 };
  }

  async generateAccessTokenFromRefreshToken(refreshToken: string) {
    const { sub, jwtid } = await this.decodeRefreshToken(refreshToken);

    const tokenDocument = await this.getStoredValidRefreshTokenById(jwtid);

    if (!tokenDocument) {
      throw new UnprocessableEntityException(
        ErrorMessages.INVALID_REFRESH_TOKEN,
      );
    }

    return this.generateAccessToken(sub, jwtid);
  }

  async getStoredValidRefreshTokenById(id: string) {
    return await this.refreshTokenModel.findOne({
      _id: id,
      isRevoked: false,
      expires: { $gte: new Date() },
    });
  }
}