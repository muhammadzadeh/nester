import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModule } from '../users/profiles/profiles.module';
import { RolesModule } from '../users/roles/roles.module';
import { AddUserToWorkspaceUsecase } from './application/usecases/add-user-to-workspace/add-user-to-workspace.usecase';
import { CreateWorkspaceUsecase } from './application/usecases/create-workspace/create-workspace.usecase';
import { FindWorkspaceUsersUsecase } from './application/usecases/find-workspace-users/find-workspace-users.usecase';
import { FindWorkspacesUsecase } from './application/usecases/find-workspaces/find-workspaces.usecase';
import { RespondInvitationUsecase } from './application/usecases/respond-invitation/respond-invitation.usecase';
import { WorkspacesService } from './application/workspaces.service';
import { WorkspaceUsersRepository } from './domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from './domain/repositories/workspaces.repository';
import { WorkspaceUserTypeormEntity } from './infrastructure/database/typeorm/entities/workspace-users.typeorm-entity';
import { WorkspaceTypeormEntity } from './infrastructure/database/typeorm/entities/workspace.typeorm-entity';
import { WorkspaceUsersTypeormRepository } from './infrastructure/database/typeorm/repositories/workspace-users.typeorm-repository';
import { WorkspacesTypeormRepository } from './infrastructure/database/typeorm/repositories/workspaces.typeorm-repository';
import { WorkspaceUserController } from './presenter/http/user/controllers/workspace.user.controller';
import { CheckWorkspacePermissionGuard } from './presenter/http/user/guards/check-workspace-permission.guard';

const workspacesRepository: Provider = {
	provide: WorkspacesRepository,
	useClass: WorkspacesTypeormRepository,
};
const workspaceUsersRepository: Provider = {
	provide: WorkspaceUsersRepository,
	useClass: WorkspaceUsersTypeormRepository,
};
@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceTypeormEntity, WorkspaceUserTypeormEntity]), ProfileModule, RolesModule],
	providers: [
		WorkspacesService,
		workspacesRepository,
		workspaceUsersRepository,
		CreateWorkspaceUsecase,
		AddUserToWorkspaceUsecase,
		CheckWorkspacePermissionGuard,
		FindWorkspaceUsersUsecase,
		RespondInvitationUsecase,
		FindWorkspacesUsecase,
	],
	controllers: [WorkspaceUserController],
	exports: [],
})
export class WorkspacesModule {}
