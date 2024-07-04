import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { DateTime, Duration } from 'luxon';
import { Exception } from '../../../common/exception';
import { Email, Mobile, UserId } from '../../../common/types';
import { randomStringAsync } from '../../../common/utils';
import { OTPEntity, OTPReason, OTPType } from '../../domain/entities';
import { OTPRepository, OTP_REPOSITORY_TOKEN } from '../../domain/repositories';

@Exception({
  errorCode: 'OTP_NOT_FOUND',
  statusCode: HttpStatus.BAD_REQUEST,
})
class OtpNotFoundException extends Error {}

const DEFAULT_TOKEN_OTP_DURATION = Duration.fromISO('PT15M');
const DEFAULT_CODE_OTP_DURATION = Duration.fromISO('PT2M');
export class OtpGeneration {
  constructor(
    readonly userId: UserId,
    readonly mobile: Mobile | undefined,
    readonly email: Email | undefined,
    readonly type: OTPType,
    readonly reason: OTPReason,
    readonly ttl: Duration = type === OTPType.CODE ? DEFAULT_CODE_OTP_DURATION : DEFAULT_TOKEN_OTP_DURATION,
  ) {
    this.expireAt = DateTime.now().toUTC().plus(this.ttl).toJSDate();
  }

  readonly expireAt: Date;
}

export class OtpVerification {
  constructor(
    readonly otp: string,
    readonly type: OTPType,
    readonly reason: OTPReason,
    readonly email?: string,
    readonly mobile?: string,
  ) {}
}

export class OTPVerificationResult {
  readonly userId!: string;
}

@Exception({
  errorCode: 'OTP_DESTINATION_INVALID',
  statusCode: HttpStatus.BAD_REQUEST,
})
class OtpDestinationInvalidException extends Error {}

@Injectable()
export class OtpService {
  constructor(@Inject(OTP_REPOSITORY_TOKEN) private readonly otpRepository: OTPRepository) {}

  async generate(otpGeneration: OtpGeneration): Promise<string> {
    const destination = otpGeneration.mobile ?? otpGeneration.email;

    if (!destination) {
      throw new OtpDestinationInvalidException('OTP generation failed, Mobile or Email is required');
    }

    const otp = await this.generateUniqueOTP(otpGeneration.type);
    const hashedOtp = this.createSHA256Hash(otp);
    const otpRecord = new OTPEntity(
      otpGeneration.userId,
      destination,
      otpGeneration.type,
      otpGeneration.reason,
      otpGeneration.expireAt,
      hashedOtp,
    );
    await this.otpRepository.save(otpRecord);

    return otp;
  }

  async verify(verification: OtpVerification): Promise<OTPVerificationResult> {
    const hashedOtp = this.createSHA256Hash(verification.otp);
    const otpRecord = await this.getOtp(verification, hashedOtp);
    const destination = verification.mobile ?? verification.email;

    otpRecord.verify(destination);
    otpRecord.markAsUsed();
    await this.otpRepository.save(otpRecord);

    return {
      userId: otpRecord.userId,
    };
  }

  private async getOtp(verification: OtpVerification, hashedOtp: string) {
    const otpRecord = await this.otpRepository.findOne({
      type: verification.type,
      reason: verification.reason,
      otp: hashedOtp,
    });
    if (!otpRecord) {
      throw new OtpNotFoundException(`The OTP not found for given criteria, ${JSON.stringify(verification)}`);
    }

    return otpRecord;
  }

  private async generateUniqueOTP(type: OTPType): Promise<string> {
    const length = type === OTPType.CODE ? 6 : 100;
    const mappedType = type === OTPType.CODE ? 'numeric' : 'url-safe';
    const otp = await randomStringAsync({ length: length, type: mappedType });

    if (type === OTPType.TOKEN) {
      const exists = await this.otpRepository.exists(otp);
      if (exists) {
        return this.generateUniqueOTP(type);
      }
    }

    return otp;
  }

  private createSHA256Hash(otp: string): string {
    const hash = createHash('sha256');
    hash.update(otp);
    return hash.digest('hex');
  }
}
