import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';
import { ICaptcha } from '../providers';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsRecaptchaValidConstraint implements ValidatorConstraintInterface {
  constructor(private readonly captchaProvider: ICaptcha) {}

  async validate(data: any) {
    await this.captchaProvider.validate(data);

    return true;
  }
}

export function IsRecaptchaValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRecaptchaValidConstraint,
    });
  };
}
