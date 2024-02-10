export enum MetaKey {
  REQUEST_SCOPE = 'request_scope',
  CONTROLLER_TYPE = 'controller_type',
  IGNORE_IS_ACTIVE_GUARD = 'ignore_is_active_guard',
  ANONYMOUS_ROUTE = 'anonymous_route',
  CHECK_IS_AVAILABILITY_UPDATED= 'is_availability_updated_guard'
}
export enum RequestScope {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ControllerType {
  ADMIN = 'GUARD:TYPE:ADMIN',
  USER = 'GUARD:TYPE:USER',
  COMMON = 'GUARD:TYPE:COMMON',
}

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
} as const;
