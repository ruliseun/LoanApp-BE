import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ValidActionsDto, ValidateLoanRepaymentDto, ValidIdDto } from '../../common/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLoanDto } from './dtos/CreateLoanDto';
import { CreateLoanPlanDto } from './dtos/CreateLoanPlanDto';
import { UpdateLoanPlanDto } from './dtos/UpdateLoanPlanDto';
import { LoanService } from './services/loan.service';

@Controller('loan')
export class LoanController {
    constructor(private loanService: LoanService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/create-plan')
    async createLoanPlan(@Body() createLoanPlanDto: CreateLoanPlanDto){
        try{
            const loanPlan = await this.loanService.createLoanPlan(createLoanPlanDto);
            return loanPlan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error creating loan plan',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createLoan(@GetUser() user, @Body() createLoanDto: CreateLoanDto){
        try{
            const loan = await this.loanService.createLoan(user, createLoanDto);
            return loan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error creating loan',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/loan-plans')
    async getLoanPlans(){
        try{
            const loanPlans = await this.loanService.getLoanPlans();
            return loanPlans;
        } catch(err){
            console.log(err)
            return {
                message: 'Error fetching loan plans',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getLoans(@Param() { id }: ValidIdDto ){
        try{
            const loans = await this.loanService.getUniqueLoanPlan(id);
            return loans;
        } catch(err){
            console.log(err)
            return {
                message: 'Error fetching loans',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/update/:id')
    async updateLoanPlan(@Param() { id }: ValidIdDto, @Body() updateLoanPlanDto: UpdateLoanPlanDto){
        try{
            const loanPlan = await this.loanService.updateLoanPlan(id, updateLoanPlanDto);
            return loanPlan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error updating loan plan',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/delete/:id')
    async deleteLoanPlan(@Param() { id }: ValidIdDto){
        try{
            const loanPlan = await this.loanService.deleteLoanPlan(id);
            return loanPlan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error deleting loan plan',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/loan-action/:action/:userId/:loanId')
    async loanAction(@Param() { action, userId, loanId }: ValidActionsDto){
        try{
            const loan = await this.loanService.loanAction(action, userId, loanId);
            return loan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error performing loan action',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('/pay')
    async loanPayment(@GetUser() user, @Body() { loanId, amount }: ValidateLoanRepaymentDto){
        try{
            const loan = await this.loanService.loanPayment(user, loanId, amount);
            return loan;
        } catch(err){
            console.log(err)
            return {
                message: 'Error performing loan payment',
                error: err.message
            }
        }
    }
}
