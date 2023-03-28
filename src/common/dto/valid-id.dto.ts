import { IsEnum, IsMongoId, IsNumber, IsString } from 'class-validator';

export class ValidIdDto {
  @IsMongoId()
  id: string;
}

export class ValidActionsDto{
  @IsString()
  @IsEnum(['approve', 'reject', 'complete', 'cancel'])
  action: string;

  @IsMongoId()
  userId: string;

  @IsMongoId()
  loanId: string;
}

export class ValidateLoanRepaymentDto{
  @IsMongoId()
  loanId: string;

  @IsNumber()
  amount: number;
}