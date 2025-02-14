import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateWorkspaceUsecase } from './application/usecases/create-workspace/create-workspace.usecase';
import { WorkspacesService } from './application/workspaces.service';
import { WorkspaceUsersRepository } from './domain/repositories/workspace-users.repository';
import { WorkspacesRepository } from './domain/repositories/workspaces.repository';
import { WorkspaceUserTypeormEntity } from './infrastructure/database/typeorm/entities/workspace-users.typeorm-entity';
import { WorkspaceTypeormEntity } from './infrastructure/database/typeorm/entities/workspace.typeorm-entity';
import { WorkspaceUsersTypeormRepository } from './infrastructure/database/typeorm/repositories/workspace-users.typeorm-repository';
import { WorkspacesTypeormRepository } from './infrastructure/database/typeorm/repositories/workspaces.typeorm-repository';
import { WorkspaceUserController } from './presenter/http/user/controllers/workspace.user.controller';

const workspacesRepository: Provider = {
	provide: WorkspacesRepository,
	useClass: WorkspacesTypeormRepository,
};
const workspaceUsersRepository: Provider = {
	provide: WorkspaceUsersRepository,
	useClass: WorkspaceUsersTypeormRepository,
};
@Module({
	imports: [TypeOrmModule.forFeature([WorkspaceTypeormEntity, WorkspaceUserTypeormEntity])],
	providers: [WorkspacesService, workspacesRepository, workspaceUsersRepository, CreateWorkspaceUsecase],
	controllers: [WorkspaceUserController],
	exports: [],
})
export class WorkspacesModule {}
