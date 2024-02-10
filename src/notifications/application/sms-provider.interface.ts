import { Mobile } from "../../common/types";
import { ChannelDispatcherResponse } from "./dispatchers";

export const MAILER_TOKEN = Symbol('Mailer');
export interface SmsSender {
  send(data: SmsSendData): Promise<ChannelDispatcherResponse>;
  getName(): string;
}

export interface SmsSendData {
  to: Mobile;
  code: string;
}
