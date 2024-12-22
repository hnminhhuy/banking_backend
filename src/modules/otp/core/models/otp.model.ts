export class OtpModel {
  userId: string;
  otp: string;
  issuedAt: Date;
  extraData?: Record<string, unknown>;

  constructor(params: Partial<OtpModel>) {
    this.issuedAt = new Date();
    Object.assign(this, params);
  }
}
