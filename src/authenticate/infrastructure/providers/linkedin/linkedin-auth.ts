import { Auth } from "../../../application/providers/auth-provider.interface";

export class LinkedinAuth implements Auth {
  constructor(readonly token: string) {}
}
