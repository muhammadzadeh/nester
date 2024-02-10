import { Auth } from "../../../application/providers/auth-provider.interface";

export class FakeAuth implements Auth {
  constructor(readonly identifier: string) {}
}
