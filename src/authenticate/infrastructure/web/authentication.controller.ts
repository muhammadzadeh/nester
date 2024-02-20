import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Captcha } from '../../../common/captcha/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../common/serialization';
import { AuthService } from '../../application/services/auth.service';
import { JwtTokenService } from '../../application/services/jwt-token.service';
import { IgnoreAuthorizationGuard } from './decorators';
import {
  AuthenticateByThirdPartyDto,
  AuthenticationResponse,
  IdentifierDto,
  IdentifierPasswordAuthDto,
  IdentifierPasswordSignupDto,
  ImpersonationDto,
  OtpGenerationDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SigninByOtpDto,
  SignupByOtpDto,
  VerifyDto,
} from './dtos';

@IgnoreAuthorizationGuard()
@ApiTags('Authentication')
@CommonController(`/auth`)
export class AuthenticationController {
  constructor(
    private readonly jwtService: JwtTokenService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async signupByIdentifierPassword(@Body() dto: IdentifierPasswordSignupDto): Promise<DoneResponse> {
    await this.authService.signupByPassword(dto.toSignupByPasswordData());
    return Serializer.done();
  }

  @Post('signup/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signupByGoogle(@Body() dto: AuthenticateByThirdPartyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signupByThirdParty(dto.toAuthenticateByThirdPartyData());
    return AuthenticationResponse.from(token!);
  }

  @Post('signup/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async signupByOtp(@Body() dto: SignupByOtpDto): Promise<DoneResponse> {
    await this.authService.signupByOtp(dto.toSignupByOtpData());
    return Serializer.done();
  }

  @Post('verify')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async verify(@Body() dto: VerifyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.verify(dto.toVerifyData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByIdentifierPassword(@Body() dto: IdentifierPasswordAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByPassword(dto.toSigninByPasswordData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByGoogle(@Body() dto: AuthenticateByThirdPartyDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByThirdParty(dto.toAuthenticateByThirdPartyData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByOtp(@Body() dto: SigninByOtpDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signinByOtp(dto.toSigninByOtpData());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/fake')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByFake(@Body() dto: ImpersonationDto): Promise<AuthenticationResponse> {
    const token = await this.authService.impersonation(dto.toImpersonationData());
    return AuthenticationResponse.from(token);
  }

  @Post('otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async generateOtp(@Body() input: OtpGenerationDto): Promise<DoneResponse> {
    await this.authService.sendOtp(input.toSendOtp());
    return Serializer.done();
  }

  @Post('password/reset-link')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async sendResetPasswordLink(@Body() input: IdentifierDto): Promise<DoneResponse> {
    await this.authService.requestResetPassword(input.identifier);
    return Serializer.done();
  }

  @Post('password/reset')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<DoneResponse> {
    await this.authService.resetPassword(dto.toOTPVerification(), dto.newPassword);
    return Serializer.done();
  }

  @Post('refresh-token')
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async refreshToken(@Body() input: RefreshTokenDto): Promise<AuthenticationResponse> {
    const token = await this.jwtService.refresh(input.toRefreshTokenData());
    return AuthenticationResponse.from(token);
  }
}
