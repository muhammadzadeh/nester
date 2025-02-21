import { Injectable } from '@nestjs/common';
import { Paginated } from '@repo/types';
import { AttachmentsService } from '../../../../attachments/application/attachments.service';
import { AttachmentEntity } from '../../../../attachments/domain/entities/attachments.entity';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { FindWorkspacesQuery } from './find-workspaces.query';

@Injectable()
export class FindWorkspacesUsecase {
	constructor(
		private readonly workspaceUsersRepository: WorkspaceUsersRepository,
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly attachmentService: AttachmentsService,
	) {}

	async execute(query: FindWorkspacesQuery): Promise<Paginated<WorkspaceEntity>> {
		const { items: workspaceUsers } = await this.workspaceUsersRepository.findAll({
			userIds: [query.userId],
		});

		const userWorkspaceIds = workspaceUsers.map((item) => item.workspaceId);
		if (!userWorkspaceIds.length) {
			return {
				items: [],
				total: 0,
			};
		}

		const { items, total } = await this.workspacesRepository.findAll(
			{
				ids: userWorkspaceIds,
			},
			query.pagination,
		);

		const logoIds: string[] = [];

		items.forEach((item) => {
			if (item.logoId && !logoIds.includes(item.logoId)) logoIds.push(item.logoId);
		});

		const logos = await this.findLogos(logoIds);

		for (const item of items) {
			item.logo = logos.find((logo) => logo.id === item.logoId);
		}

		return {
			items,
			total,
		};
	}

	private async findLogos(ids: string[]): Promise<AttachmentEntity[]> {
		if (!ids.length) {
			return [];
		}

		return this.attachmentService.findMany({
			attachmentIds: ids,
		});
	}
}
