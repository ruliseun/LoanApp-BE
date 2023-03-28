import { IsOptional } from 'class-validator';
import { CreateLoanPlanDto } from './CreateLoanPlanDto';

export class UpdateLoanPlanDto extends CreateLoanPlanDto {
    @IsOptional()
    name: string;
    
    @IsOptional()
    amount: number;
    
    @IsOptional()
    duration: number;
    
    @IsOptional()
    interest: number;
    
    @IsOptional()
    monthlyRepayment: number;
    
    @IsOptional()
    totalRepayment: number;
}