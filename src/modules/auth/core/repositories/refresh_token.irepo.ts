import { RefreshTokenModel } from '../models/refresh_token.model';

export abstract class IRefreshTokenRepo {
  public abstract create(refreshToken: RefreshTokenModel): Promise<void>;
  public abstract get(
    key: string,
    value: unknown,
  ): Promise<RefreshTokenModel | undefined>;
  public abstract deleteById(id: string): Promise<boolean>;
}
