import { Auth } from "../../../application/services/auth-provider";

export class FacebookAuth implements Auth {
  constructor(readonly token: string) {}
}
