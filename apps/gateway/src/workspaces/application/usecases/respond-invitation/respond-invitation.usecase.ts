import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { WorkspaceUserStatus } from '../../../domain/enums/workspace-user-status.enum';
import { InvitationAlreadyRespondedException } from '../../../domain/exceptions/invitation-already-responded.exception';
import { InvitationNotFoundException } from '../../../domain/exceptions/invitation-not-found.exception';
import { WorkspaceNotFoundException } from '../../../domain/exceptions/workspace-not-found.exception';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { RespondInvitationCommand } from './respond-invitation.command';

@Injectable()
export class RespondInvitationUsecase {
	constructor(
		private readonly workspaceUsersRepository: WorkspaceUsersRepository,
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly usersService: UsersService,
	) {}

	async execute(command: RespondInvitationCommand): Promise<void> {
		const workspaceUser = await this.workspaceUsersRepository.findOne({
			tokens: [command.token],
		});

		if (!workspaceUser) {
			throw new InvitationNotFoundException(`Its not possible to find invitation token(${command.token})`);
		}

		if (!workspaceUser.canRespond()) {
			throw new InvitationAlreadyRespondedException(
				`Already responded to invitation(${workspaceUser.id}). the user(${command.userId}) request to respond.`,
			);
		}

		const workspace = await this.workspacesRepository.findOne({
			ids: [workspaceUser.workspaceId],
		});

		if (!workspace) {
			throw new WorkspaceNotFoundException(`The workspace ${workspaceUser.workspaceId} not found!`);
		}

		const loggedInUser = await this.usersService.findOneByIdentifierOrFail(command.userId);
		if (
			(workspaceUser.email && workspaceUser.email !== loggedInUser.email) ||
			(workspaceUser.mobile && workspaceUser.mobile !== loggedInUser.mobile)
		) {
			throw new InvitationNotFoundException(
				`Its not possible to respond to invitation token(${command.token}), user information miss-match invitation information`,
			);
		}

		if (command.status === WorkspaceUserStatus.ACCEPTED) {
			workspaceUser.markAsAccepted(command.userId);
		} else if (command.status === WorkspaceUserStatus.REJECTED) {
			workspaceUser.markAsRejected(command.userId);
		}

		await this.workspaceUsersRepository.save(workspaceUser);
	}
}
