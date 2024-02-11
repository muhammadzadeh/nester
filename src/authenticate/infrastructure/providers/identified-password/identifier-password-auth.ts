import { Email, Mobile, UserId, Username } from "../../../../common/types";
import { Auth } from "../../../application/providers/auth-provider.interface";

export class IdentifierPasswordAuth implements Auth {
  constructor(readonly identifier: Email | Mobile | Username | UserId, readonly password: string) {}
}
