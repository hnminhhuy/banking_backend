import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { UserModel } from '../models/user.model';

@Injectable()
export class UpdateUserPassword {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.userRepo.getUserBy('id', id, undefined);
    if (!user) {
      throw new NotFoundException(`User ${id} does not exist`);
    }

    if (!user.verifyPassword(oldPassword)) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await UserModel.hashPassword(newPassword);
    return await this.userRepo.updatePassword(id, hashedPassword);
  }
}
