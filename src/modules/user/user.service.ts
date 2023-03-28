import { BadRequestException, forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DbSchemas, ErrorMessages } from '../../common/constants';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/CreateUserDto';
import { UserDocument, ReturnDataDocument, Filter } from './dtos/interfaces/user.interface';
import { UserFiles } from './user.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(DbSchemas.user)
    private userModel: Model<UserDocument>,
    private readonly cloudinaryService: CloudinaryService,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {}

  async getUserByEmail(email: string) {
    return this.userModel
      .findOne({
        email: {
          $regex: email,
          $options: 'i',
        },
      })
      .select('+password');
  }
  
  async createUser(creatUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const matchedQuery = [
      { email: creatUserDto.email },
      { phoneNumber: creatUserDto.phoneNumber },
    ];
    const userExists = await this.userModel.findOne({ $or: matchedQuery });
    if(userExists){
      throw new NotFoundException(ErrorMessages.USER_EXISTS)
    }
    const user = await this.userModel.create({ ...creatUserDto });

    const createWallet = await this.walletService.createWallet(
      user._id.toString(),
    );

    if (!createWallet) {
      throw new BadRequestException(ErrorMessages.FAILED_TO_CREATE_WALLET);
    }
    return {
      message: 'User successfully created',
      user
    }
  }

  async getAllUsers(filter: Filter) {
    const PAGINATION = 10;
    const user = await this.userModel.aggregate([
      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
            {
              $addFields: {
                current_page: filter.page,
                has_next_page: {
                  $cond: {
                    if: {
                      $lt: [{ $multiply: [filter.page, PAGINATION] }, "$total"],
                    },
                    then: true,
                    else: false,
                  },
                },
                has_previous_page: {
                  $cond: {
                    if: {
                      $gt: [filter.page, 1],
                    },
                    then: true,
                    else: false,
                  },
                },
                next_page: {
                  $add: [filter.page, 1],
                },
                previous_page: {
                  $cond: {
                    if: {
                      $gt: [filter.page, 1],
                    },
                    then: {
                      $subtract: [filter.page, 1],
                    },
                    else: 1,
                  },
                },
                last_page: {
                  $ceil: {
                    $divide: ["$total", PAGINATION],
                  },
                },
              },
            },
          ],
          users: [
            {
              $skip: (filter.page - 1) * PAGINATION,
            },
            {
              $limit: PAGINATION,
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                phoneNumber: 1,
                dateOfBirth: 1,
                address: 1,
                occupation: 1,
                profileImage: 1,
                gender: 1,
                activeLoan: 1,
                activeLoanAmount: 1,
                activeLoanDuration: 1,
                activeLoanBalance: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]);

    let returnData: ReturnDataDocument = {
      user: null,
      metadata: {
        total: 0,
        current_page: 1,
        has_next_page: false,
        has_previous_page: false,
        next_page: 2,
        previous_page: 1,
        last_page: 1,
      }
    };

    if (user[0].metadata[0]) {
      returnData.user = user[0].users;
      const [metadata] = user[0].metadata;
      returnData.metadata = metadata;
    } else {
      returnData.user = user[0].users;
      returnData.metadata;
    }

    return returnData;
  }

  async getUserById(id: string){
    const user = await this.userModel.findById(id);

    if(!user){
      throw new NotFoundException(ErrorMessages.userNotFound(id))
    }

    return {
      message: 'User successfully retrieved',
      user
    }
  }

  async updateUser(id: string, updateUserDto: CreateUserDto, files: UserFiles){
    const existingUser = await this.getUserById(id);

    let profileImageLink = '';
    if (files?.profileImage) {
      const { profileImage } = files;

      const { secure_url } = await this.cloudinaryService.uploadImage(
        profileImage[0],
      );

      profileImageLink = secure_url;
    }

    Object.assign(existingUser.user, {...updateUserDto, ...(!!profileImageLink && { profileImage: profileImageLink })});

    const updatedUser = await existingUser.user.save();

    return {
      message: 'User successfully updated',
      updatedUser
    }
  }

  async deleteUser(id: string){
    const existingUser = await this.userModel.findByIdAndDelete(id);
    return {
      message: 'User successfully deleted',
      deletedUser: existingUser
    }
  }
}