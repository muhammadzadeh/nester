import { Auth } from "../../../application/services/auth-provider";

export class FakeAuth implements Auth {
  constructor(readonly identifier: string) {}
}
