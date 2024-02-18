import { Auth } from "../../../application/services/auth-provider";

export class GoogleSignup implements Auth {
  constructor(readonly token: string) {}
}
