import { Auth } from "../../../application/providers/auth-provider.interface";

export class GoogleAuth implements Auth {
  constructor(readonly token: string) {}
}
