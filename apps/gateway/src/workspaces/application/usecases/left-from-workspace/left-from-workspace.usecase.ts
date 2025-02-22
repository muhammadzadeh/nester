import { Injectable } from '@nestjs/common';
import { InvitationNotFoundException } from '../../../domain/exceptions/invitation-not-found.exception';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { LeftFromWorkspaceCommand } from './left-from-workspace.command';

@Injectable()
export class LeftFromWorkspaceUsecase {
	constructor(private readonly workspaceUsersRepository: WorkspaceUsersRepository) {}

	async execute(command: LeftFromWorkspaceCommand): Promise<void> {
		const workspaceUser = await this.workspaceUsersRepository.findOne({
			userIds: [command.userId],
			workspaceIds: [command.workspaceId],
		});

		if (!workspaceUser) {
			throw new InvitationNotFoundException(`Its not possible to find invitation for (${command.workspaceId})`);
		}
		workspaceUser.markAsDeleted();

		await this.workspaceUsersRepository.save(workspaceUser);
	}
}
