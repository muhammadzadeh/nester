import { Mobile } from "../../common/types";
import { NotificationDispatcherResponse } from "./notifications.dispatcher";

export const SMS_SENDER_TOKEN = Symbol('SmsSender');
export interface SmsSender {
  send(data: SendSmsData): Promise<NotificationDispatcherResponse>;
  getName(): string;
}

export interface SendSmsData {
  to: Mobile;
  code: string;
}
