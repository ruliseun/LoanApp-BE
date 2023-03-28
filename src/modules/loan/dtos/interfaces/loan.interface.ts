import { Document } from 'mongoose';

export interface LoanPlanDocument extends Document {
    name: string;
    amount: number;
    duration: number;
    interest: number;
    monthlyRepayment: number;
    totalRepayment: number;
    dateCreated: string;
    dateUpdated: string;
}

export interface LoanApplicationDocument extends Document {
    userId: string;
    loanId: string;
    amount: number;
    duration: number;
    status: string;
    dateApplied: string;
    dateApproved: string;
    dateRejected: string;
    dateCompleted: string;
    dateCancelled: string;
    dateDue: string;
    datePaid: string;
    dateCreated: string;
    dateUpdated: string;
}