import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class LoanPlan {
    @Prop({
        required: true,
        uppercase: true,
    })
    name: string;
    
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
    })
    interest: number;
    
    @Prop({
        required: true,
    })
    monthlyRepayment: number;
    
    @Prop({
        required: true,
    })
    totalRepayment: number;
    
    @Prop({
        default: Date.now()
    })
    dateCreated: string;
    
    @Prop({
        default: Date.now()
    })
    dateUpdated: string;
}

export const LoanPlanSchema = SchemaFactory.createForClass(LoanPlan);