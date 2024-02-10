import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import parser from 'ua-parser-js';

interface WebInfo {
  type: 'web';
  subType: 'mobile' | 'tablet' | 'desktop';
}

interface MobileInfo {
  type: 'ios' | 'android';
  subType: 'mobile';
  version: number;
}

export type DeviceInfo = WebInfo | MobileInfo;

function isValidApp(os: string): os is 'android' | 'ios' {
  const validTypes = new Set(['android', 'ios']);
  return validTypes.has(os);
}

const getAppInfo = (os: unknown, build: unknown): undefined | MobileInfo => {
  if (typeof os != 'string' || typeof build != 'string') return;

  const type = os.toLowerCase();
  if (!isValidApp(type)) return;

  const version = +build;
  if (isNaN(version)) return;

  return { type, subType: 'mobile', version };
};

function getWebInfo(ua: unknown): undefined | WebInfo {
  if (typeof ua != 'string') return;
  const parsedUA = parser(ua);

  if (parsedUA.device.type == 'tablet') {
    return { type: 'web', subType: 'tablet' };
  }

  if (parsedUA.device.type == 'mobile') {
    return { type: 'web', subType: 'mobile' };
  }

  return { type: 'web', subType: 'desktop' };
}

export function determineDeviceInfoFromHeader(headerValue: FastifyRequest['headers']): DeviceInfo {
  const os = headerValue['os'];
  const build = headerValue['build'];

  const appInfo = getAppInfo(os, build);
  if (appInfo != undefined) return appInfo;

  const userAgent = headerValue['user-agent'];

  const webInfo = getWebInfo(userAgent);
  if (webInfo != undefined) return webInfo;
  return { type: 'web', subType: 'desktop' };
}

export const DeviceInfo = createParamDecorator((_: unknown, ctx: ExecutionContext): DeviceInfo => {
  const { headers } = ctx.switchToHttp().getRequest();
  return determineDeviceInfoFromHeader(headers);
});
