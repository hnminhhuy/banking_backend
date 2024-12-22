import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserModel } from 'src/modules/user/core/models/user.model';
import {
  GetUserUsecase,
  UpdateUserPasswordUsecase,
} from 'src/modules/user/core/usecases';

@Injectable()
export class ResetPasswordUsecase {
  constructor(
    private readonly updateUserPasswordUsecase: UpdateUserPasswordUsecase,
  ) {}

  public async execute(
    userId: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword)
      throw new BadRequestException('Passwords do not match');
    return await this.updateUserPasswordUsecase.execute(
      userId,
      false,
      newPassword,
    );
  }
}
