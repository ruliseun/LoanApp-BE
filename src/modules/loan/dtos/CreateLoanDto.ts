import { IsNotEmpty, IsNumber, IsString, IsMongoId } from 'class-validator';

export class CreateLoanDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string;

    @IsNotEmpty()
    @IsMongoId()
    loanId: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    duration: number;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    dateApplied: string;

    @IsNotEmpty()
    @IsString()
    dateApproved: string;

    @IsNotEmpty()
    @IsString()
    dateRejected: string;

    @IsNotEmpty()
    @IsString()
    dateCompleted: string;

    @IsNotEmpty()
    @IsString()
    dateCancelled: string;

    @IsNotEmpty()
    @IsString()
    dateDue: string;

    @IsNotEmpty()
    @IsString()
    datePaid: string;

    @IsNotEmpty()
    @IsString()
    dateCreated: string;

    @IsNotEmpty()
    @IsString()
    dateUpdated: string;
}