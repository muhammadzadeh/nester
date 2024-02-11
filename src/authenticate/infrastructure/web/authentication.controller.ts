import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Captcha } from '../../../common/captcha/decorators';
import { CommonController } from '../../../common/guards/decorators';
import { DoneSerializer, Serializer } from '../../../common/serialization';
import { AuthService, JwtTokenService, PasswordService } from '../../application';
import { IgnoreAuthorizationGuard } from './decorators';
import {
  AuthenticationResponse,
  EmailDto,
  EmailPasswordSignupDto,
  FakeAuthDto,
  GoogleAuthDto,
  GoogleSignupDto,
  IdentifierPasswordAuthDto,
  OtpAuthDto,
  OtpGenerationDto,
  OtpSignupDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SignupResponse,
} from './dtos';
import { VerifyDto } from './dtos/verify.dto';

@IgnoreAuthorizationGuard()
@ApiTags('Authentication')
@CommonController(`/auth`)
export class AuthenticationController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtTokenService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async signupByIdentifierPassword(@Body() dto: EmailPasswordSignupDto): Promise<DoneSerializer> {
    await this.authService.signup(dto.toIdentifierPasswordSignup());
    return Serializer.done();
  }

  @Post('signup/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: SignupResponse,
  })
  async signupByGoogle(@Body() dto: GoogleSignupDto): Promise<SignupResponse> {
    const token = await this.authService.signup(dto.toGoogleSignup());
    return Serializer.serialize(SignupResponse, {
      token: token,
    });
  }

  @Post('signup/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async signupByOtp(@Body() dto: OtpSignupDto): Promise<DoneSerializer> {
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
    const token = await this.authService.authenticate(dto.toOtpAuth());
    return Serializer.serialize(AuthenticationResponse, token);
  }

  @Post('signin/identifier-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByIdentifierPassword(@Body() dto: IdentifierPasswordAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toIdentifierPasswordAuth());
    return Serializer.serialize(AuthenticationResponse, token);
  }

  @Post('signin/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByGoogle(@Body() dto: GoogleAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toGoogleAuth());
    return Serializer.serialize(AuthenticationResponse, token);
  }

  @Post('signin/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByOtp(@Body() dto: OtpAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toOtpAuth());
    return Serializer.serialize(AuthenticationResponse, token);
  }

  @Post('signin/fake')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async signinByFake(@Body() dto: FakeAuthDto): Promise<AuthenticationResponse> {
    const token = await this.authService.authenticate(dto.toFakeAuth());
    return Serializer.serialize(AuthenticationResponse, token);
  }

  @Post('otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async generateOtp(@Body() input: OtpGenerationDto): Promise<DoneSerializer> {
    await this.authService.sendOtp(input.toSendOtp());
    return Serializer.done();
  }

  @Post('password/reset-link')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async sendResetPasswordLink(@Body() { email }: EmailDto): Promise<DoneSerializer> {
    await this.passwordService.sendResetPasswordLink(email);
    return Serializer.done();
  }

  @Post('password/reset')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<DoneSerializer> {
    await this.passwordService.resetPassword(dto.toOTPVerification(), dto.new_password);
    return Serializer.done();
  }

  @Post('refresh-token')
  @ApiOkResponse({
    status: 200,
    type: AuthenticationResponse,
  })
  async refreshToken(@Body() input: RefreshTokenDto): Promise<AuthenticationResponse> {
    const token = await this.jwtService.refresh(input.toRefreshTokenData());
    return Serializer.serialize(AuthenticationResponse, token);
  }
}
