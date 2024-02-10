import { Body, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Captcha } from '../../../common/captcha/decorators';
import { UserController } from '../../../common/guards/decorators';
import { DoneSerializer, Serializer } from '../../../common/serialization';
import { AuthService, JwtTokenService, PasswordService } from '../../application';
import { IgnoreAuthorizationGuard } from './decorators';
import {
  AuthenticationSerializer,
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
  SignupSerializer,
} from './dtos';

@IgnoreAuthorizationGuard()
@ApiTags('Authentication')
@UserController(`/auth`)
export class AuthenticationController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtTokenService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup/email-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: DoneSerializer,
  })
  async signupByEmailAndPassword(@Body() dto: EmailPasswordSignupDto): Promise<DoneSerializer> {
    await this.authService.signup(dto.toEmailPasswordSignup());
    return Serializer.done();
  }

  @Post('signup/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: SignupSerializer,
  })
  async signupByGoogle(@Body() dto: GoogleSignupDto): Promise<SignupSerializer> {
    const token = await this.authService.signup(dto.toGoogleSignup());
    return Serializer.serialize(SignupSerializer, {
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

  @Post('signin/email-password')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationSerializer,
  })
  async signinByEmail(@Body() dto: IdentifierPasswordAuthDto): Promise<AuthenticationSerializer> {
    const token = await this.authService.authenticate(dto.toIdentifierPasswordAuth());
    return Serializer.serialize(AuthenticationSerializer, token);
  }

  @Post('signin/google')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationSerializer,
  })
  async signinByGoogle(@Body() dto: GoogleAuthDto): Promise<AuthenticationSerializer> {
    const token = await this.authService.authenticate(dto.toGoogleAuth());
    return Serializer.serialize(AuthenticationSerializer, token);
  }

  @Post('signin/otp')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationSerializer,
  })
  async signinByOtp(@Body() dto: OtpAuthDto): Promise<AuthenticationSerializer> {
    const token = await this.authService.authenticate(dto.toOtpAuth());
    return Serializer.serialize(AuthenticationSerializer, token);
  }

  @Post('signin/fake')
  @Captcha()
  @ApiOkResponse({
    status: 200,
    type: AuthenticationSerializer,
  })
  async signinByFake(@Body() dto: FakeAuthDto): Promise<AuthenticationSerializer> {
    const token = await this.authService.authenticate(dto.toFakeAuth());
    return Serializer.serialize(AuthenticationSerializer, token);
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
    type: AuthenticationSerializer,
  })
  async refreshToken(@Body() input: RefreshTokenDto): Promise<AuthenticationSerializer> {
    const token = await this.jwtService.refresh(input.toRefreshTokenData());
    return Serializer.serialize(AuthenticationSerializer, token);
  }
}
