import { Injectable } from '@nestjs/common';
import { AttachmentsService } from '../../../../attachments/application/attachments.service';
import { InvalidAvatarException } from '../../../../users/profiles/domain/entities/user.entity';
import { WorkspaceEntity } from '../../../domain/entities/workspace.entity';
import { WorkspaceWriteFactory } from '../../../domain/factories/workspace.factory';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { CreateWorkspaceCommand } from './create-workspace.command';

@Injectable()
export class CreateWorkspaceUsecase {
	constructor(
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly attachmentService: AttachmentsService,
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

		return this.workspacesRepository.save(
			WorkspaceWriteFactory.create({
				creatorId: command.userId,
				logoId: command.logoId,
				title: command.title,
			}),
		);
	}
}
