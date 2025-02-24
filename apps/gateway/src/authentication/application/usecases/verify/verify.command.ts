import { BaseCommand, Email, Mobile } from '@package/types';
import { OTPType } from '../../../domain/entities';

export class VerifyCommand extends BaseCommand {
	otp!: string;
	type!: OTPType;
	identifier!: Email | Mobile;
}
