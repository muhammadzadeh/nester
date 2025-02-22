import { Module } from '@nestjs/common';
import { CheckSignupGuard } from './check-signup.guard';
import { IsUserEnableGuard } from './is-user-enable.guard';

@Module({
	providers: [CheckSignupGuard, IsUserEnableGuard],
})
export class AuthenticationModule {}
