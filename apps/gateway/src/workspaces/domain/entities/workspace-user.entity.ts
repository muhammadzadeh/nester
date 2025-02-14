
export class WorkspaceUserEntity {

    constructor(id: string, userId: string, workspaceId: string, roleId: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null,) {
        this.id = id;
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.roleId = roleId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    readonly id!: string;
    readonly userId!: string;
    readonly workspaceId!: string;
    readonly roleId!: string;
    readonly createdAt!: Date;
    updatedAt!: Date;
    deletedAt!: Date | null;

}