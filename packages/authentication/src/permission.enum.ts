export type Permission = SystemPermission | WorkspacePermission;

export enum SystemPermission {
	MANAGE_EVERY_THINGS = '*',
	READ_ALL = 'read:*',
	WRITE_ALL = 'write:*',
	READ_USERS = 'read:users',
	WRITE_USERS = 'write:users',
	READ_ATTACHMENTS = 'read:attachments',
	WRITE_ATTACHMENTS = 'write:attachments',
	READ_NOTIFICATIONS = 'read:notifications',
	WRITE_NOTIFICATIONS = 'write:notifications',
	READ_ROLES = 'read:roles',
	WRITE_ROLES = 'write:roles',
	WRITE_COUNTRIES = 'write:countries',
}

export enum WorkspacePermission {
	MANAGE_EVERY_THINGS = 'workspace:*',
	READ_ALL = 'workspace:read:*',
	WRITE_ALL = 'workspace:write:*',
	READ_USERS = 'workspace:read:users',
	WRITE_USERS = 'workspace:write:users',
	READ_WORKSPACE = 'workspace:read',
	WRITE_WORKSPACE = 'workspace:write',
}
