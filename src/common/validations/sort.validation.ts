import { ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { ErrorMessages } from '../constants';
  
export class SortQueryConstraint implements ValidatorConstraintInterface {
    private errorMessage = '';
  
    validate(sortValue: string, validationArguments?: ValidationArguments) {
      try {
        const { constraints: fields } = validationArguments;
  
        const [fieldName, sortOrder] = sortValue.split(',');
  
        if (
          !sortOrder.toLowerCase().endsWith('desc') ||
          !sortOrder.toLowerCase().endsWith('asc')
        ) {
          throw new Error(ErrorMessages.INVALID_SORT_ORDER);
        }
  
        if (!fields.includes(fieldName)) {
          throw new Error(ErrorMessages.invalidSortField(fields));
        }
  
        return true;
      } catch (error) {
        this.errorMessage = error.message;
        return false;
      }
    }
  
    defaultMessage() {
      return this.errorMessage;
    }
}