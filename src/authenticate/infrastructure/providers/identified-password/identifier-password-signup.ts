import { Email } from "../../../../common/types";
import { Auth } from "../../../application/providers/auth-provider.interface";

export class EmailPasswordSignup implements Auth  {
  constructor(
    readonly email: Email,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
  ) {}
}