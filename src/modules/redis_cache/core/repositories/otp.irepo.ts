export abstract class IOtpRepo {
  public abstract setCache(key: string, valueStr: string): Promise<void>;
  public abstract getCache(key: string): Promise<unknown>;
  public abstract removeCache(key: string): Promise<void>;
}
