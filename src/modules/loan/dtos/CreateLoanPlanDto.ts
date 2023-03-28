import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLoanPlanDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;
    
    @IsNotEmpty()
    @IsNumber()
    duration: number;
    
    @IsNotEmpty()
    @IsNumber()
    interest: number;
    
    @IsNotEmpty()
    @IsNumber()
    monthlyRepayment: number;
    
    @IsNotEmpty()
    @IsNumber()
    totalRepayment: number;
}