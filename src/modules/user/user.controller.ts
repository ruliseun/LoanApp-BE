import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ValidIdDto } from '../../common/dto';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UpdateUserDto } from './dtos/UpdateUserDto';
import { UserService } from './user.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserFiles } from './user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/create')
    async createMedia(@Body() createUserDto: CreateUserDto){
        console.log('running createUser')
       try{
        const user = await this.userService.createUser(createUserDto);
        return user;
       } catch(err){
           console.log(err)
           return {
                message: 'Error creating user',
                error: err.message
           }
       }
    }

    @Get('/')
    async getAllUsers(@Param() { page }: PaginationDto){
        const filter = {
            page: page || 1,
        }
        try{
            const users = await this.userService.getAllUsers(filter);
            return users;
        } catch(err){
            console.log(err)
            return {
                message: 'Error getting users',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getUserById(@Param() { id }: ValidIdDto){
        try{
            const user = await this.userService.getUserById(id);
            return user;
        } catch(err){
            console.log(err)
            return {
                message: 'Error getting user',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/:id')
    @UseInterceptors(
        FileFieldsInterceptor([{ name: 'profileImage', maxCount: 1 }]),
    )
    async updateUser(@Param() { id }: ValidIdDto, @Body() updateUserDto: UpdateUserDto, @UploadedFiles() files: UserFiles){
        try{
            const user = await this.userService.updateUser(id, updateUserDto, files);
            return user;
        } catch(err){
            console.log(err)
            return {
                message: 'Error updating user',
                error: err.message
            }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    async deleteUser(@Param() { id }: ValidIdDto){
        try{
            const user = await this.userService.deleteUser(id);
            return user;
        } catch(err){
            console.log(err)
            return {
                message: 'Error deleting user',
                error: err.message
            }
        }
    }
}
