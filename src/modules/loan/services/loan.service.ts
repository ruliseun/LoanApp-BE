import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { DbSchemas, ErrorMessages } from '../../../common/constants';
import { Model } from 'mongoose';
import { CreateLoanDto } from '../dtos/CreateLoanDto';
import { CreateLoanPlanDto } from '../dtos/CreateLoanPlanDto';
import { LoanPlanDocument, LoanApplicationDocument } from '../dtos/interfaces/loan.interface'
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../../user/user.interface';
import { WalletService } from '../../wallet/wallet.service';
import { WalletDocument } from '../../wallet/interfaces/wallet.interface';

@Injectable()
export class LoanService {
    private readonly logger = new Logger(LoanService.name);
    constructor(
        @InjectModel(DbSchemas.loanplan)
        private loanPlanModel: Model<LoanPlanDocument>,
        @InjectModel(DbSchemas.loan)
        private loanApplicationModel: Model<LoanApplicationDocument>,
        @InjectModel(DbSchemas.user)
        private userModel: Model<UserDocument>,
        @InjectModel(DbSchemas.wallet)
        private walletModel: Model<WalletDocument>,
        @Inject(forwardRef(() => WalletService))
        private readonly walletService: WalletService,
    ) {}

    async createLoan(user: UserDocument, createLoanDto: CreateLoanDto){
        const userRecord = JSON.parse(JSON.stringify(user));
        const validateLoanPlan = await this.loanPlanModel.findOne({ _id: createLoanDto.loanId });
        if(!validateLoanPlan){
            throw new BadRequestException(ErrorMessages.LOAN_PLAN_NOT_FOUND)
        }
        const validateOneTimeLoanApplication = await this.loanApplicationModel.findOne({ loanId: createLoanDto.loanId });
        if(validateOneTimeLoanApplication && validateOneTimeLoanApplication.status !== 'completed'){
            throw new BadRequestException(ErrorMessages.USER_ALREADY_ACTIVE_LOAN)
        }
        const validateSingleLoan = await this.loanApplicationModel.findOne({ userId: userRecord.user._id });
        if(validateSingleLoan && validateSingleLoan.status !== 'completed'){
            throw new BadRequestException(ErrorMessages.CANNOT_APPLY_MORE_THAN_ONE_LOAN)
        }
        const loan = await this.loanApplicationModel.create({ 
            ...createLoanDto,
            userId: userRecord.user._id,
            loanId: validateLoanPlan._id,
            amount: validateLoanPlan.amount,
            duration: validateLoanPlan.duration,
        });
        const activeLoadRecord = await this.userModel.findById(userRecord.user._id);
        activeLoadRecord.activeLoan.push(loan._id);
        activeLoadRecord.activeLoanAmount = validateLoanPlan.amount;
        activeLoadRecord.activeLoanDuration = validateLoanPlan.duration;
        activeLoadRecord.activeLoanBalance = validateLoanPlan.amount;
        await activeLoadRecord.save();
        return {
            message: 'Loan successfully created',
            loan,
            user: activeLoadRecord
        }
    }

    async createLoanPlan(createLoanPlanDto: CreateLoanPlanDto){
        const validateUniqueLoanPlan = await this.loanPlanModel.findOne({ name: createLoanPlanDto.name });
        if(validateUniqueLoanPlan){
            throw new BadRequestException(ErrorMessages.LOAN_PLAN_EXISTS)
        }
        const loanPlan = await this.loanPlanModel.create(createLoanPlanDto);
        return {
            message: 'Loan plan successfully created',
            loanPlan
        }
    }

    async getLoanPlans(){
        const loanPlans = await this.loanPlanModel.find();
        return {
            message: 'Loan plans successfully fetched',
            loanPlans
        }
    }

    async getUniqueLoanPlan(id: string){
        const loanPlan = await this.loanPlanModel.findById(id);

        if(!loanPlan){
            throw new BadRequestException(ErrorMessages.LOAN_PLAN_NOT_FOUND)
        }

        return {
            message: 'Loan plan successfully fetched',
            loanPlan
        }
    }

    async updateLoanPlan(id: string, createLoanPlanDto: CreateLoanPlanDto){
        const existingLoanPlan = await this.getUniqueLoanPlan(id);

        if(createLoanPlanDto.amount && (!createLoanPlanDto.duration || !createLoanPlanDto.interest && createLoanPlanDto.monthlyRepayment && createLoanPlanDto.totalRepayment)){
            throw new BadRequestException(ErrorMessages.LOAN_PLAN_INCOMPLETE)
        }

        Object.assign(existingLoanPlan.loanPlan, createLoanPlanDto);

        const updatedLoanPlan = await existingLoanPlan.loanPlan.save();

        return {
            message: 'Loan plan successfully updated',
            updatedLoanPlan
        }
    }

    async deleteLoanPlan(id: string){
        const loanPlan = await this.loanPlanModel.findByIdAndDelete(id);
        return {
            message: 'Loan plan successfully deleted',
            deletedPlan: loanPlan
        }
    }

    async loanAction(action: string, userId: string, loanId: string){
        if(!action || !userId || !loanId){
            throw new BadRequestException(ErrorMessages.INVALID_PARAMS)
        }
        const matchQuery = { userId, loanId };
        const loan = await this.loanApplicationModel.findOne(matchQuery);
        if(!loan){
            throw new BadRequestException(ErrorMessages.LOAN_NOT_FOUND)
        }
        const dateNow = new Date();

        switch(action){
            case 'approve':
                if(loan.status === 'rejected' || loan.status === 'cancelled'){
                    throw new BadRequestException(ErrorMessages.LOAN_ALREADY_REJECTED)
                }
                loan.dateApproved = `${new Date()}`;
                loan.status = 'approved';
                dateNow.setMonth(dateNow.getMonth() + loan.duration);
                loan.dateDue = `${dateNow}`;
                await loan.save();
                const updateWallet = await this.walletService.fundWallet(userId, loan.amount);
                return {
                    message: 'Loan successfully approved',
                    loan,
                    wallet: updateWallet
                }
            case 'reject':
                if(loan.status === 'approved'){
                    throw new BadRequestException(ErrorMessages.LOAN_ALREADY_APPROVED)
                }
                loan.dateRejected = `${new Date()}`;
                loan.status = 'rejected';
                loan.dateDue = null;
                await loan.save();
                return {
                    message: 'Loan successfully rejected',
                    loan
                }
            case 'complete':
                if(loan.status === 'rejected' || loan.status === 'cancelled'){
                    throw new BadRequestException(ErrorMessages.LOAN_ALREADY_REJECTED)
                }
                loan.dateCompleted = `${new Date()}`;
                loan.status = 'completed';
                loan.dateDue = null;
                await loan.save();
                return {
                    message: 'Loan successfully completed',
                    loan
                }
            case 'cancel':
                if(loan.status === 'approved'){
                    throw new BadRequestException(ErrorMessages.LOAN_ALREADY_APPROVED)
                }
                loan.dateCancelled = `${new Date()}`;
                loan.status = 'cancelled';
                loan.dateDue = null;
                await loan.save();
                return {
                    message: 'Loan successfully cancelled',
                    loan
                }
            default:
                throw new BadRequestException(ErrorMessages.INVALID_ACTION)
        }
    }

    async loanPayment(user: UserDocument, loanId: string, amount: number){
        const loanReset = 0;
        if(!loanId || !amount) throw new BadRequestException(ErrorMessages.LOAN_ID_AND_AMOUNT_REQUIRED);
        if(amount <= 0){
            throw new BadRequestException(ErrorMessages.INVALID_LOAN_PAYMENT_AMOUNT)
        }
        const userRecord = JSON.parse(JSON.stringify(user));
        const walletRecord = await this.walletService.getWallet(userRecord.user._id);
        const { wallet } = walletRecord;
        
        const loan = await this.loanApplicationModel.findOne({ userId: userRecord.user._id, loanId });
        if(loan.status !== 'approved'){
            throw new BadRequestException(ErrorMessages.LOAN_NOT_APPROVED)
        }

        const getLoanPlan = await this.loanPlanModel.findOne({ _id: loan.loanId });

        const baseAmount = getLoanPlan.totalRepayment - wallet.balance;

        if(amount < baseAmount || amount > baseAmount){
            throw new BadRequestException(ErrorMessages.invalidLoanRepaymentAmount(baseAmount))
        }

        const walletUpdate = await this.walletModel.findByIdAndUpdate(wallet._id, { balance: loanReset }, { new: true });

        loan.status = 'completed';
        loan.dateCompleted = `${new Date()}`;
        loan.datePaid = `${new Date()}`;
        loan.dateDue = null;
        await loan.save();

        const updateUserRecordPayload = {
            activeLoan: [],
            activeLoanAmount: loanReset,
            activeLoanDuration: loanReset,
            activeLoanBalance: loanReset
        }
        await this.userModel.findByIdAndUpdate(userRecord.user._id, updateUserRecordPayload);

        return {
            message: 'Loan successfully paid',
            loan,
            wallet: walletUpdate,
        }
    }
}