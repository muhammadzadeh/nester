import { Injectable } from '@nestjs/common';
import { NotificationEvent } from '@repo/types';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { sendNotification } from '../../../../notifications/infrastructure/utils';
import { UsersService } from '../../../../users/profiles/application/users.service';
import { UserAlreadyInWorkspaceException } from '../../../domain/exceptions/user-already-in-workspace.exception';
import { WorkspaceNotFoundException } from '../../../domain/exceptions/workspace-not-found.exception';
import { WorkspaceUserWriteFactory } from '../../../domain/factories/workspace-user.factory';
import { WorkspaceUsersRepository } from '../../../domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from '../../../domain/repositories/workspaces.repository';
import { AddUserToWorkspaceCommand } from './add-user-to-workspace.command';

@Injectable()
export class AddUserToWorkspaceUsecase {
	constructor(
		private readonly workspaceUsersRepository: WorkspaceUsersRepository,
		private readonly workspacesRepository: WorkspacesRepository,
		private readonly usersService: UsersService,
		private readonly i18n: I18nService,
	) {}

	async execute(command: AddUserToWorkspaceCommand): Promise<void> {
		const workspace = await this.workspacesRepository.findOne({
			ids: [command.workspaceId],
		});

		if (!workspace) {
			throw new WorkspaceNotFoundException(`The workspace ${command.workspaceId} not found!`);
		}

		const exists = await this.workspaceUsersRepository.exists({
			workspaceIds: [command.workspaceId],
			mobiles: command.mobile ? [command.mobile] : undefined,
			emails: command.email ? [command.email] : undefined,
		});

		if (exists) {
			throw new UserAlreadyInWorkspaceException(
				`The user(${command.mobile ?? command.email}) already in workspace ${command.workspaceId}`,
			);
		}

		const invitedUser = await this.usersService.findOneByIdentifier(command.mobile ?? command.email!);

		const inviterUser = await this.usersService.findOneByIdentifierOrFail(command.userId);

		const createdRecord = await this.workspaceUsersRepository.save(
			WorkspaceUserWriteFactory.create({
				invitedByUserId: command.userId,
				userId: invitedUser?.id ?? null,
				email: command.email,
				mobile: command.mobile,
				roleId: command.roleId,
				workspaceId: command.workspaceId,
			}),
		);

		sendNotification({
			event: NotificationEvent.INVITED_TO_WORKSPACE,
			emailData: command.email
				? {
						to: command.email,
						title: this.i18n.t(`notification.${NotificationEvent.INVITED_TO_WORKSPACE}.email.title`, {
							lang: I18nContext.current()?.lang,
							args: { name: workspace.title, inviterName: inviterUser.fullName },
						}),
						body: {
							workspaceId: command.workspaceId,
							token: createdRecord.token,
							workspaceName: workspace.title,
						},
						template: NotificationEvent.INVITED_TO_WORKSPACE,
					}
				: undefined,
			smsData: command.mobile
				? {
						message: '', //FIXME we need to send the user short-link?
						to: command.mobile,
						template: NotificationEvent.INVITED_TO_WORKSPACE,
					}
				: undefined,
			notificationCenterData: invitedUser
				? {
						title: this.i18n.t(`notification.${NotificationEvent.INVITED_TO_WORKSPACE}.notification.title`, {
							lang: I18nContext.current()?.lang,
							args: { name: workspace.title, },
						}),
						description: this.i18n.t(`notification.${NotificationEvent.INVITED_TO_WORKSPACE}.notification.description`, {
							lang: I18nContext.current()?.lang,
							args: { name: workspace.title, inviterName: inviterUser.fullName },
						}),
					}
				: undefined,
		});
	}
}
