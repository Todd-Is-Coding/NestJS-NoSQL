import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema /user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async findUsers(): Promise<User[]> {
    return this.user.find().exec();
  }

  async findUserById(id: string): Promise<User> {
    const currentUser = await this.user.findById(id).exec();
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    return currentUser;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.user.create(createUserDto);

    if (!newUser) {
      throw new NotFoundException('User not found');
    }
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.user
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.user.findByIdAndDelete(id).exec();
  }
}
