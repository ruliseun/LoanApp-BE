import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DbSchemas, ErrorMessages } from '../../common/constants';
import { LeanWallet, WalletDocument } from './interfaces/wallet.interface';

@Injectable()
export class WalletService {
    private readonly logger = new Logger(WalletService.name);
    constructor(
        @InjectModel(DbSchemas.wallet)
        private readonly walletModel: Model<WalletDocument>
    ) {}

    async getWallet(id: string) {
        const wallet = await this.walletModel.findOne({ userId: id });
        return {
          message: 'Balance fetched successfully',
          wallet: wallet.toObject(),
        };
    }

    async createWallet(userId: string, balance?: number): Promise<LeanWallet> {
        const wallet = await this.walletModel.create({
          userId,
          balance: balance || 0,
        });
    
        return wallet.toObject();
    }

    async fundWallet(userId: string, amount: number) {
        const existingWallet = await this.walletModel.findOne({ userId });
    
        if (!existingWallet) {
            throw new BadRequestException(ErrorMessages.WALLET_NOT_FOUND);
        }
    
        existingWallet.balance += amount;
        existingWallet.totalMoneyReceived += amount;
    
        await existingWallet.save();
    
        return existingWallet.toObject();
    }

}
