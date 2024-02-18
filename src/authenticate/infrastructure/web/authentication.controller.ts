import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Captcha } from '../../../common/captcha/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { DoneResponse, Serializer } from '../../../common/serialization';
import { AuthService, JwtTokenService } from '../../application';
import { IgnoreAuthorizationGuard } from './decorators';
import {
  AuthenticationResponse,
  FakeAuthDto,
  GoogleAuthDto,
  GoogleSignupDto,
  IdentifierDto,
  IdentifierPasswordAuthDto,
  IdentifierPasswordSignupDto,
  SigninByOtpDto,
  OtpGenerationDto,
  OtpSignupDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SigninMethodDto,
  SigninMethodResponse,
} from './dtos';
import { VerifyDto } from './dtos/verify.dto';

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
    await this.authService.signup(dto.toIdentifierPasswordSignup());
    return Serializer.done();
  }

  @Post('signup/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signupByGoogle(@Body() dto: GoogleSignupDto): Promise<AuthenticationResponse> {
    const token = await this.authService.signup(dto.toGoogleSignup());
    return AuthenticationResponse.from(token!);
  }

  @Post('signup/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneResponse,
  })
  async signupByOtp(@Body() dto: OtpSignupDto): Promise<DoneResponse> {
    await this.authService.signup(dto.toOtpSignup());
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

  @Post('signin/methods')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: SigninMethodResponse,
  })
  async getAuthenticateMethods(@Body() dto: SigninMethodDto): Promise<SigninMethodResponse> {
    const signinMethods = await this.authService.getAuthenticateMethods(dto.identifier);
    return SigninMethodResponse.from(signinMethods);
  }

  @Post('signin/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByIdentifierPassword(@Body() dto: IdentifierPasswordAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toIdentifierPasswordAuth());
    return AuthenticationResponse.from(token);
  }

  @Post('signin/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByGoogle(@Body() dto: GoogleAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toGoogleAuth());
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
  async signinByFake(@Body() dto: FakeAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toFakeAuth());
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
