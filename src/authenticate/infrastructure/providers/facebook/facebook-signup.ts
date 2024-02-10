import { Auth } from "../../../application/providers/auth-provider.interface";

export class FacebookSignup implements Auth {
  constructor(readonly token: string) {}
}
