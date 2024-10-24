import { ControllerType } from './enums';

export const TENANT_CONFIG = {
  USER: {
    type: ControllerType.USER,
    name: 'User',
    route: '/user',
  },
  ADMIN: {
    type: ControllerType.ADMIN,
    name: 'Admin',
    route: '/admin',
  },
  COMMON: {
    type: ControllerType.COMMON,
    name: 'Common',
    route: '/common',
  },
};
