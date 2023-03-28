export class ErrorMessages {
  static USER_EXISTS = 'User with email/phone number already exists';
  static FAILED_TO_CREATE_WALLET = 'Failed to create wallet';
  static WALLET_NOT_FOUND = 'Wallet not found';
  static RECORD_NOT_FOUND = 'Record not found';
  static EXPIRED_REFRESH_TOKEN = 'Refresh token has expired';
  static INVALID_REFRESH_TOKEN = 'Refresh token is invalid';
  static INVALID_SORT_ORDER = "Sort order can only be 'asc' or 'desc'";
  static LOAN_PLAN_NOT_FOUND = 'Loan plan not found';
  static LOAN_PLAN_EXISTS = 'Loan plan already exists';
  static LOAN_PLAN_INCOMPLETE = 'Updating Amount requires Duration, Interest, Monthly Repayment and Total Repayment to be updated as well';
  static USER_ALREADY_ACTIVE_LOAN = 'You already applied for this Loan';
  static CANNOT_APPLY_MORE_THAN_ONE_LOAN = 'You cannot apply for more than one loan at a time, Please pay off your current loan to apply for another loan';
  static LOAN_ALREADY_APPROVED = 'Loan has already been approved';
  static LOAN_ALREADY_REJECTED = 'Loan has already been rejected / cancelled';
  static LOAN_NOT_FOUND = 'Loan record not found';
  static INVALID_ACTION = 'Invalid action';
  static INVALID_LOAN_PAYMENT_AMOUNT = 'Invalid loan payment amount';
  static LOAN_ID_AND_AMOUNT_REQUIRED = 'Loan id and amount are required';
  static INVALID_PARAMS = 'Invalid parameters';
  static LOAN_NOT_APPROVED = 'Loan has not been approved';

  static userNotFound(id: string) {
    return `User with id ${id} not found`;
  }

  static userEmailNotFound(email: string) {
    return `${email} does not exist`;
  }

  static invalidSortField(fields: string[]) {
    return `Sort field should be one of ${fields.join(',')}`;
  }

  static invalidLoanRepaymentAmount (requiredAmount: number){
    return `You need to pay ${requiredAmount} to complete this loan`;
  }
}  