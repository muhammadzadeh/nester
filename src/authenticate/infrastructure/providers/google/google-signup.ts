import { Auth } from "../../../application/providers/auth-provider.interface";

export class GoogleSignup implements Auth {
  constructor(readonly token: string) {}
}
