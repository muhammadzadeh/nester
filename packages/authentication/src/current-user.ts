import { Email, Mobile, UserId } from "@repo/types";
import { Permission } from "./permission.enum";

export type CurrentUser = {
	id: UserId;
	email: Email | null;
	mobile: Mobile | null;
	isEmailVerified: boolean;
	isMobileVerified: boolean;
	permissions?: Permission[];
	isBlocked: boolean;
};