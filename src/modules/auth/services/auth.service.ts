import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ErrorMessages } from '../../../common/constants';
import { RefreshTokenDto } from '../../user/dtos/RefreshTokenDto';
import { UserDocument } from '../../user/user.interface';
import { UserService } from '../../user/user.service';
import { TokenService } from './token.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException(ErrorMessages.userEmailNotFound(email));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument, userAgent: string) {
    // GENERATE A REFRESH TOKEN
    const refreshToken = await this.tokenService.generateRefreshToken(
      user,
      userAgent,
    );

    const { jwtid } = await this.tokenService.decodeRefreshToken(refreshToken);

    // GENERATE AN ACCESS TOKEN

    const { accessToken, expiresIn } =
      await this.tokenService.generateAccessToken(user._id.toString(), jwtid);

    return this.buildResponse(accessToken, refreshToken, expiresIn, user);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const { accessToken, expiresIn } =
      await this.tokenService.generateAccessTokenFromRefreshToken(refreshToken);

    return this.buildResponse(accessToken, refreshToken, expiresIn);
  }

  private buildResponse(
    accessToken: string,
    refreshToken: string,
    expiresIn: number, // in milliseconds
    user?: UserDocument,
  ) {
    return {
      message: 'Login successful',
      accessToken,
      refreshToken,
      expiresIn,
      ...(user && { user }),
    };
  }
  
}