import { Auth } from "../../../application/providers/auth-provider.interface";

export class FakeSignup implements Auth {
  constructor(readonly identifier: string) {}
}
