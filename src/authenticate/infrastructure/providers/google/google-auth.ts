import { Auth } from "../../../application/services/auth-provider";

export class GoogleAuth implements Auth {
  constructor(readonly token: string) {}
}
