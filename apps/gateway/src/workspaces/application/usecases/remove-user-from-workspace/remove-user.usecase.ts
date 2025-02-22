import { Injectable } from '@nestjs/common';
import { InvitationNotFoundException } from '../../../domain/exceptions/invitation-not-found.exception';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { RemoveWorkspaceUserCommand } from './remove-user.command';

@Injectable()
export class RemoveWorkspaceUserUsecase {
	constructor(private readonly workspaceUsersRepository: WorkspaceUsersRepository) {}

	async execute(command: RemoveWorkspaceUserCommand): Promise<void> {
		const workspaceUser = await this.workspaceUsersRepository.findOne({
			ids: [command.workspaceUserId],
		});

		if (!workspaceUser) {
			throw new InvitationNotFoundException(`Its not possible to find invitation for (${command.workspaceUserId})`);
		}
		workspaceUser.markAsDeleted();

		await this.workspaceUsersRepository.save(workspaceUser);
	}
}
