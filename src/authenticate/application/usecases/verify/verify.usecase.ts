import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { AccessType, JwtTokenService, OtpService, Token } from '../../services';
import { Exception } from '../../../../common/exception';
import { publish } from '../../../../common/rabbit/application/rabbit-mq.service';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../users/roles/application/roles.service';
import { Permission } from '../../../../users/roles/domain/entities/role.entity';
import { AUTHENTICATION_EXCHANGE_NAME } from '../../../domain/constants';
import { OTPReason } from '../../../domain/entities';
import { AuthenticationEvents, UserVerifiedEvent } from '../../../domain/events';
import { VerifyCommand } from './verify.command';

@Injectable()
export class VerifyUsecase {
  private readonly logger = new Logger(VerifyUsecase.name);

  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly otpService: OtpService,
  ) {}

  async execute(command: VerifyCommand): Promise<Token> {
    const email = isEmail(command.identifier) ? command.identifier : undefined;
    const mobile = isPhoneNumber(command.identifier) ? command.identifier : undefined;
    if (!mobile || !email) {
      this.logger.log(`to verify user, we need email or mobile ${command.identifier}`);
      throw new CannotVerifyException(`to verify user, we need email or mobile ${command.identifier}`);
    }

    const verifyResult = await this.otpService.verify({
      otp: command.otp,
      reason: OTPReason.VERIFY,
      type: command.type,
      email,
      mobile,
    });

    const user = await this.usersService.findOneByIdentifier(verifyResult.userId);
    if (!user) {
      this.logger.log(`user not found, ${command.identifier}`);
      throw new CannotVerifyException(`user not found, ${command.identifier}`);
    }

    if (mobile) {
      user.isMobileVerified = true;
    }

    if (email) {
      user.isEmailVerified = true;
    }

    publish(AUTHENTICATION_EXCHANGE_NAME, AuthenticationEvents.USER_VERIFIED, new UserVerifiedEvent(user));

    return await this.generateToken(user);
  }

  private async generateToken(user: UserEntity): Promise<Token> {
    const permissions = await this.findUserPermissions(user);
    return await this.tokenService.generate({
      accessType: AccessType.VERIFIED_USER,
      email: user.email,
      mobile: user.mobile,
      isEmailVerified: user.isEmailVerified,
      isMobileVerified: user.isMobileVerified,
      userId: user.id,
      isBlocked: user.isBlocked,
      permissions,
    });
  }

  private async findUserPermissions(user: UserEntity): Promise<Permission[]> {
    const permissions: Permission[] = [];
    if (!user.hasRole()) {
      return permissions;
    }

    try {
      const role = await this.rolesService.findOneById(user.roleId!);
      permissions.push(...role.permissions);
    } catch (error) {
      this.logger.error(error);
    }
    return permissions;
  }
}

@Exception({
  errorCode: 'CAN_NOT_VERIFY',
  statusCode: HttpStatus.BAD_REQUEST,
})
export class CannotVerifyException extends Error {}
