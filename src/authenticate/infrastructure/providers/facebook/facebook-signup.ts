import { Auth } from "../../../application/services/auth-provider";

export class FacebookSignup implements Auth {
  constructor(readonly token: string) {}
}
