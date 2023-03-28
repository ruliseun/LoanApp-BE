import { Controller, Body, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    getWallet(@GetUser() user) {
        return this.walletService.getWallet(user._id);
    }
}
