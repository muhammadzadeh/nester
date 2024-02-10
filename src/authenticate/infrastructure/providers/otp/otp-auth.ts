import { OTPReason, OTPType } from '../../../domain/entities';
import { Auth } from '../../../application/providers/auth-provider.interface';

export class OtpAuth implements Auth {
  constructor(
    readonly otp: string,
    readonly type: OTPType,
    readonly reason: OTPReason,
    readonly email?: string,
    readonly mobile?: string,
  ) {}
}
