import { UserModel } from '../models/user.model';

export abstract class IUserRepo {
  public abstract create(user: UserModel): Promise<void>;

  public abstract getUserBy(
    key: string,
    value: unknown,
    relations: string[] | undefined,
  ): Promise<UserModel | undefined>;
}
