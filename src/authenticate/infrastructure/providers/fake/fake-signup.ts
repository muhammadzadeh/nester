import { Auth } from "../../../application/services/auth-provider";

export class FakeSignup implements Auth {
  constructor(readonly identifier: string) {}
}
