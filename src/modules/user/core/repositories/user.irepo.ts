import { UserModel, UserModelParams } from '../models/user.model';

export abstract class IUserRepo {
  public abstract create(user: UserModel): Promise<void>;

  public abstract getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<UserModel | undefined>;

  public abstract update(
    id: string,
    updatedFields: Partial<UserModelParams>,
  ): Promise<boolean>;

  public abstract updatePassword(
    id: string,
    password: string,
  ): Promise<boolean>;
}
