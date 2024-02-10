import { ValidationError as CommonValidationError } from '@nestjs/common';
import { ValidationError as ClassValidationError } from 'class-validator';

type ValidationError = ClassValidationError | CommonValidationError;

export class ValidationException extends Error {
  constructor(public errors: IFlatError[]) {
    super();
  }

  getFlatErrors(): IFlatError[] {
    return this.errors;
  }

  static fromErrors(errors: ValidationError[]): ValidationException {
    return new ValidationException(this.reduceErrors(errors));
  }

  private static extract(e: ValidationError, parent: string[]): IErrors[] {
    return Object.keys(e.constraints!).map((validation: string) => ({
      message: e.constraints![validation],
      field: [...parent, e.property],
      validation: validation,
    }));
  }

  private static flattenErrors(errors: ValidationError[], parent: string[]): IErrors[] {
    return errors
      .map((e) =>
        e.constraints === undefined
          ? this.flattenErrors(e.children ?? [], [...parent, e.property])
          : this.extract(e, parent),
      )
      .reduce((t, i) => t.concat(i), []);
  }

  private static reduceErrors(e: ValidationError[]): IFlatError[] {
    return this.flattenErrors(e, []).map((i) => ({
      ...i,
      field: i.field.join('.'),
    }));
  }
}

export interface IFlatError {
  message: string;
  field: string;
  validation: string;
}

interface IErrors {
  message: string;
  field: string[];
  validation: string;
}