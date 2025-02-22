import { BaseCommand } from '@repo/types';
import { OTPType } from '../../../domain/entities';

export class SigninByOtpCommand extends BaseCommand {
	readonly otp!: string;
	readonly type!: OTPType;
	readonly identifier!: string;
}
