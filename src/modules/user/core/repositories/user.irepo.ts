import { UserModel } from '../models/user.model';

export abstract class IUserRepo {
  public abstract create(user: UserModel): Promise<void>;
}
