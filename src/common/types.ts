export type Email = string;
export type Username = string;
export type Mobile = string;
export type UserId = string;

export enum OrderDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ResponseGroup {
  EVERY_ONE = 'every_oen',
  ADMIN = 'admin',
  ADMIN_LIST = 'admin_list',
  RESOURCE_OWNER = 'resource_owner',
  RESOURCE_OWNER_LIST = 'resource_owner_list',
  RESOURCE_VIEWER = 'resource_viewer',
  RESOURCE_VIEWER_LIST = 'resource_viewer_list',
}
