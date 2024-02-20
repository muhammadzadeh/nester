import { Injectable, Logger } from '@nestjs/common';
import { isEmail, isPhoneNumber } from 'class-validator';
import { Configuration } from '../../../../common/config';
import { Hash } from '../../../../common/hash';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserEntity } from '../../../../users/profiles/domain/entities/user.entity';
import { RolesService } from '../../../../users/roles/application/roles.service';
import { Permission } from '../../../../users/roles/domain/entities/role.entity';
import { InvalidCredentialException, UserNotVerifiedException } from '../../exceptions';
import { AccessType, JwtTokenService, Token } from '../../services';
import { SigninByPasswordCommand } from './signin-by-password';

@Injectable()
export class SigninByPasswordUsecase {
  private readonly logger = new Logger(SigninByPasswordUsecase.name);

  constructor(
    private readonly tokenService: JwtTokenService,
    private readonly configuration: Configuration,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async execute(command: SigninByPasswordCommand): Promise<Token> {
    const user = await this.usersService.findOneByIdentifier(command.identifier);
    if (!user) {
      throw new InvalidCredentialException(`User with ${command.identifier} not found`);
    }

    if (!user.password) {
      throw new InvalidCredentialException(`User with ${command.identifier} has no password`);
    }

    if (!this.configuration.authentication.allowUnverifiedSignin && !user.isVerified()) {
      throw new UserNotVerifiedException(`Unverified user ${command.identifier} trying sign!`);
    }

    if (
      !this.configuration.authentication.allowUnverifiedSignin &&
      isEmail(command.password) &&
      !user.isEmailVerified
    ) {
      throw new UserNotVerifiedException(`Unverified user ${command.identifier} trying sign!`);
    }

    if (
      !this.configuration.authentication.allowUnverifiedSignin &&
      isPhoneNumber(command.identifier) &&
      !user.isMobileVerified
    ) {
      throw new UserNotVerifiedException(`Unverified user ${command.identifier} trying sign!`);
    }

    const isPasswordsMatch = await Hash.compare(command.password, user.password);

    if (!isPasswordsMatch) {
      throw new InvalidCredentialException(`Passwords mismatch for ${command.identifier}`);
    }

    return await this.generateToken(user);
  }

  private async generateToken(user: UserEntity): Promise<Token> {
    const permissions = await this.findUserPermissions(user);
    return await this.tokenService.generate({
      accessType: user.isVerified() ? AccessType.VERIFIED_USER : AccessType.UNVERIFIED_USER,
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
