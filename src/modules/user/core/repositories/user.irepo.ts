import { Page, PageParams, SortParams } from 'src/common/models';
import { UserModel, UserModelParams } from '../models/user.model';
import { UserSort } from '../enums/user_sort';
import { UserRole } from '../enums/user_role';

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

  public abstract list(
    role: UserRole,
    pageParams: PageParams,
    sortParams: SortParams<UserSort>,
    relations: string[] | undefined,
  ): Promise<Page<UserModel>>;

  public abstract updateBlocked(
    id: string,
    isBlocked: boolean,
  ): Promise<boolean>;

  public abstract getBlockedUser(): Promise<string[]>;
}
