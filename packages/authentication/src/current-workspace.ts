import { WorkspacePermission } from './permission.enum';

export type CurrentWorkspace = {
	id: string;
	permissions: WorkspacePermission[];
};
