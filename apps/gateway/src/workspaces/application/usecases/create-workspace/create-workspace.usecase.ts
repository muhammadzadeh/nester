import { Injectable } from '@nestjs/common';
import { Configuration } from '@package/config';
import { AttachmentsService } from '../../../../attachments/application/attachments.service';
import { InvalidAvatarException } from '../../../../users/profiles/domain/entities/user.entity';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceUserWriteFactory } from '../../../domain/factories/workspace-user.factory';
import { WorkspaceWriteFactory } from '../../../domain/factories/workspace.factory';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { CreateWorkspaceCommand } from './create-workspace.command';

@Injectable()
export class CreateWorkspaceUsecase {
	constructor(
		private readonly workspaceUsersRepository: WorkspaceUsersRepository,
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly attachmentService: AttachmentsService,
		private readonly configuration: Configuration,
	) {}

	async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
		if (command.logoId) {
			const avatarRecord = await this.attachmentService.findOne(command.logoId);
			if (!avatarRecord) {
				throw new InvalidAvatarException(`Logo not found!`);
			}

			if (avatarRecord.isPrivate()) {
				throw new InvalidAvatarException(`Only public attachment allowed for logo!`);
			}
		}

		const createdWorkspace = await this.workspacesRepository.save(
			WorkspaceWriteFactory.create({
				creatorId: command.userId,
				logoId: command.logoId,
				title: command.title,
			}),
		);

		const workspaceDefaultUser = WorkspaceUserWriteFactory.create({
			invitedByUserId: command.userId,
			userId: command.userId,
			email: null,
			mobile: null,
			roleId: this.configuration.workspace.defaultRoleId,
			workspaceId: createdWorkspace.id,
		});

		workspaceDefaultUser.markAsAccepted(command.userId);

		await this.workspaceUsersRepository.save(
			workspaceDefaultUser
		);

		return createdWorkspace;
	}
}
