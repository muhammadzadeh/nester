import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
/* import { Configuration } from './config'; */

@ValidatorConstraint({ async: true })
@Injectable()
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
  constructor(/* private readonly config: Configuration */) {}

  async validate(password: any) {
   /*  const passwordRegex = new RegExp(this.config.authentication.passwordRegEx);
    return typeof password === 'string' && passwordRegex.test(password); */
    return true;
  }

  defaultMessage(): string {
    return `Password must be strong!`;
  }
}

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStrongPasswordConstraint,
    });
  };
}
