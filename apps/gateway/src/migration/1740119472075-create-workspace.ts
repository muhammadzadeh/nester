import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkspace1740119472075 implements MigrationInterface {
	name = 'CreateWorkspace1740119472075';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "workspaces" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "creator_id" uuid NOT NULL, "logo_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "workspaces_id_pkey" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(`CREATE TYPE "public"."WorkspaceUserStatus" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
		await queryRunner.query(
			`CREATE TABLE "workspace_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "invited_by_user_id" uuid NOT NULL, "workspace_id" uuid NOT NULL, "role_id" uuid NOT NULL, "email" character varying, "mobile" character varying, "token" character varying NOT NULL, "status" "public"."WorkspaceUserStatus" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "workspace_users_token_u" UNIQUE ("token"), CONSTRAINT "workspace_users_id_pkey" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "workspace_users"`);
		await queryRunner.query(`DROP TYPE "public"."WorkspaceUserStatus"`);
		await queryRunner.query(`DROP TABLE "workspaces"`);
	}
}
