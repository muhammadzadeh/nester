import { Auth } from "../../../application/services/auth-provider";

export class LinkedinSignup implements Auth {
  constructor(readonly token: string) {}
}
