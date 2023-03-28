import { Body, Controller, Post, Get, Headers, Request, UseGuards } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { RefreshTokenDto } from '../user/dtos/RefreshTokenDto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async getLogin(@Request() req: any, @Headers() headers: Headers) {
      const userAgent = headers['user-agent'];
  
      return this.authService.login(req.user, userAgent);
    }

    @Post('/refresh')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    getProfile(@GetUser() user) {
        return user;
    }
}
