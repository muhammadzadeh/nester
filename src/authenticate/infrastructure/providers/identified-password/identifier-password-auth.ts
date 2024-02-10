import { Auth } from "../../../application/providers/auth-provider.interface";

export class IdentifierPasswordAuth implements Auth {
  constructor(readonly identifier: string, readonly password: string) {}
}
