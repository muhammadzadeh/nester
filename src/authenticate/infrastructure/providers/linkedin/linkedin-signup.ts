import { Auth } from "../../../application/providers/auth-provider.interface";

export class LinkedinSignup implements Auth {
  constructor(readonly token: string) {}
}
