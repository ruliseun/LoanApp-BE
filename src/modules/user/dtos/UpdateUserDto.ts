import { IsOptional } from 'class-validator';
import { GenderEnum } from 'src/common/enums';
import { CreateUserDto } from './CreateUserDto';

export class UpdateUserDto extends CreateUserDto {
    @IsOptional()
    fullName: string;

    @IsOptional()
    email: string;

    @IsOptional()
    phoneNumber: string;

    @IsOptional()
    password: string;

    @IsOptional()
    profileImage: string;

    @IsOptional()
    gender: GenderEnum;

    @IsOptional()
    dateOfBirth: string;

    @IsOptional()
    address: string;

    @IsOptional()
    occupation: string;

    @IsOptional()
    activeLoan: Array<string>;
}