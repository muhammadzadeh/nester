import { AttachmentEntity } from '../../../attachments/domain/entities/attachments.entity';

export class WorkspaceEntity {
	constructor(
		id: string,
		title: string,
		logoId: string | null,
		creatorId: string,
		createdAt: Date,
		updatedAt: Date,
		deletedAt: Date | null,
	) {
		this.id = id;
		this.creatorId = creatorId;
		this.title = title;
		this.logoId = logoId;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.deletedAt = deletedAt;
	}

	readonly id!: string;
	readonly creatorId!: string;
	title!: string;
	logoId!: string | null;
	readonly createdAt!: Date;
	updatedAt!: Date;
	deletedAt!: Date | null;

	logo!: AttachmentEntity | null;
}
