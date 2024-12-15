import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepo } from '../repositories/user.irepo';
import { BaseException } from 'src/exceptions';
import { ERROR_CODES } from 'src/common/utils/constants';

@Injectable()
export class BlockUserUsecase {
  constructor(private readonly userRepo: IUserRepo) {}

  public async execute(id: string): Promise<boolean> {
    const result = await this.userRepo.updateBlocked(id, true);
    if (!result) {
      throw new BaseException({
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: 'Failed to block user',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    // TODO: Update cache after blocked user in database.

    return result;
  }
}
