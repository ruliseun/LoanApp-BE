import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  balance: number;
}