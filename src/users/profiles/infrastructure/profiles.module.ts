import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../../roles/infrastructure/roles.module';
import { DefaultUserSeeder } from '../application/default-user.seeder';
import { CreateUserUsecase } from '../application/usecases/create-user/create-user.usecase';
import { UpdatePasswordUsecase } from '../application/usecases/update-password/update-password.usecase';
import { UsersConsumer } from '../application/users.consumer';
import { UsersService } from '../application/users.service';
import { USERS_REPOSITORY_TOKEN } from '../domain/repositories/users.repository';
import { TypeormUserEntity } from './database/entities/typeorm-user.entity';
import { TypeormUsersRepository } from './database/repositories/typeorm-users.repository';
import { ProfileControllerForAdmin } from './web/admin/profile.admin.controller';
import { ProfileControllerForUser } from './web/user/profile.user.controller';

const usersRepository: Provider = {
  provide: USERS_REPOSITORY_TOKEN,
  useClass: TypeormUsersRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TypeormUserEntity]), RolesModule],
  controllers: [ProfileControllerForUser, ProfileControllerForAdmin],
  providers: [
    UsersService,
    usersRepository,
    UsersConsumer,
    DefaultUserSeeder,
    CreateUserUsecase,
    UpdatePasswordUsecase,
  ],
  exports: [UsersService],
})
export class ProfileModule {}
