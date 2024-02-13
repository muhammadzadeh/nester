import { Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  imports: [TypeOrmModule.forFeature([TypeormUserEntity])],
  controllers: [ProfileControllerForUser, ProfileControllerForAdmin],
  providers: [UsersService, usersRepository, UsersConsumer],
  exports: [UsersService],
})
export class ProfileModule {}
