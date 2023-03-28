import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Loan {
    @Prop({
        required: true,
        ref: 'User'
    })
    userId: string;

    @Prop({
        required: true,
        ref: 'LoanPlan'
    })
    loanId: string;

    @Prop({
        required: true,
    })
    amount: number;

    @Prop({
        required: true,
    })
    duration: number;

    @Prop({
        required: true,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    })
    status: string;

    @Prop({
        required: true,
        default: Date.now()
    })
    dateApplied: string;

    @Prop({
        default: null
    })
    dateApproved: string;

    @Prop({
        default: null
    })
    dateRejected: string;

    @Prop({
        default: null
    })
    dateCompleted: string;

    @Prop({
        default: null
    })
    dateCancelled: string;

    @Prop({
        default: null
    })
    dateDue: string;

    @Prop({
        default: null
    })
    datePaid: string;

    @Prop({
        default: Date.now()
    })
    dateCreated: string;

    @Prop({
        default: Date.now()
    })
    dateUpdated: string;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);