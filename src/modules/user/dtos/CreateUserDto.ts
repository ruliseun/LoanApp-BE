import { IsNotEmpty, IsEmail, IsString, IsBoolean, IsNumber } from 'class-validator';
import { GenderEnum } from 'src/common/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  occupation: string;

  @IsNotEmpty()
  @IsString()
  profileImage: string;

  @IsNotEmpty()
  @IsString()
  gender: GenderEnum;

  @IsNotEmpty()
  @IsBoolean()
  activeLoan: Array<string>;

  @IsNotEmpty()
  @IsNumber()
  activeLoanAmount: number;

  @IsNotEmpty()
  @IsNumber()
  activeLoanDuration: number;

  @IsNotEmpty()
  @IsNumber()
  activeLoanBalance: number; 
}