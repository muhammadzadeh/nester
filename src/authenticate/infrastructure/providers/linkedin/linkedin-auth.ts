import { Auth } from "../../../application/services/auth-provider";

export class LinkedinAuth implements Auth {
  constructor(readonly token: string) {}
}
