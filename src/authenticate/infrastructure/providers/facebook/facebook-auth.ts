import { Auth } from "../../../application/providers/auth-provider.interface";

export class FacebookAuth implements Auth {
  constructor(readonly token: string) {}
}
