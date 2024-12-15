import { ConfigModel } from '../models/config.model';

export abstract class IConfigRepo {
  public abstract get(key: string): Promise<ConfigModel>;
}
