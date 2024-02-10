import { ChannelDispatcherResponse } from "./dispatchers";

export const MAILER_TOKEN = Symbol('Mailer');
export interface Mailer {
  sendMail(data: EmailMappedData): Promise<ChannelDispatcherResponse>;
  getName(): string;
}

export interface EmailMappedData {
  to: string;
  template: string;
  title: string | undefined;
  body: { [key: string]: any };
}
