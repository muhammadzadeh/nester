import { Options } from './option.interface';

export class ExceptionMap {
  private static exceptions: Record<string, Options> = {};

  static get(exception: Error): Options | undefined {
    return this.exceptions[exception.constructor.name];
  }

  static getAll(): Record<string, Options> {
    return this.exceptions;
  }

  static set(options: Options, exception: Error): void {
    this.exceptions[exception.name] = options;
  }
}
