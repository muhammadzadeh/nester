import { UserId } from '../types';
import { BaseCommand } from './base.command';

export abstract class AuthenticatedCommand extends BaseCommand {
  public readonly userId!: UserId;
}
