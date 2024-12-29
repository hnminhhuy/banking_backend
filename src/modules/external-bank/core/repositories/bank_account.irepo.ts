export abstract class IBankAccountRepo {
  abstract get(id: string): Promise<any>;
}
