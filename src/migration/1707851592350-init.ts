import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1707851592350 implements MigrationInterface {
    name = 'Init1707851592350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('not_read', 'read')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_group_type_enum" AS ENUM('success', 'inform', 'failure')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_alert_status_enum" AS ENUM('none', 'not_read', 'read')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event" character varying NOT NULL, "version" character varying NOT NULL DEFAULT '1.0', "user_id" uuid, "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'not_read', "group_type" "public"."notifications_group_type_enum" NOT NULL, "priority" "public"."notifications_priority_enum" NOT NULL, "alert_status" "public"."notifications_alert_status_enum" NOT NULL DEFAULT 'none', "show_as_alert" boolean NOT NULL, "notification_center_data" jsonb, "email_data" jsonb, "push_data" jsonb, "sms_data" jsonb, "deleted_at" TIMESTAMP, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_NOTIFICATIONS_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_NOTIFICATIONS_USER_ID" ON "notifications" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_NOTIFICATIONS_STATUS" ON "notifications" ("status") `);
        await queryRunner.query(`CREATE TYPE "public"."notification_push_tokens_provider_enum" AS ENUM('fcm', 'apn')`);
        await queryRunner.query(`CREATE TABLE "notification_push_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "token" character varying NOT NULL, "provider" "public"."notification_push_tokens_provider_enum" NOT NULL DEFAULT 'fcm', "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_NOTIFICATION_PUSH_TOKENS_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_logs_type_enum" AS ENUM('code', 'token')`);
        await queryRunner.query(`CREATE TYPE "public"."otp_logs_reason_enum" AS ENUM('login', 'verify', 'reset_password')`);
        await queryRunner.query(`CREATE TABLE "otp_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "destination" character varying NOT NULL, "otp" character varying NOT NULL, "user_id" uuid NOT NULL, "type" "public"."otp_logs_type_enum" NOT NULL, "reason" "public"."otp_logs_reason_enum" NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE, "used_at" TIMESTAMP WITH TIME ZONE, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_OTP_LOGS_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."attachments_visibility_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying, "name" character varying, "original_name" character varying, "visibility" "public"."attachments_visibility_enum" NOT NULL, "mime_type" jsonb, "size" integer NOT NULL, "uploader_id" uuid NOT NULL, CONSTRAINT "PK_ATTACHMENTS_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ATTACHMENTS_UPLOADER_ID" ON "attachments" ("uploader_id") `);
        await queryRunner.query(`CREATE TABLE "attachment_users" ("attachment_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_ATTACHMENT_USERS_ID" PRIMARY KEY ("attachment_id", "user_id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "permissions" character varying array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_system_role" boolean NOT NULL, CONSTRAINT "PK_ROLES_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fist_name" character varying, "last_name" character varying, "full_name" character varying, "email" character varying, "mobile" character varying, "avatar" character varying,  "avatar_id" uuid, "password" character varying, "username" character varying, "is_blocked" boolean NOT NULL DEFAULT false, "is_email_verified" boolean NOT NULL DEFAULT false, "is_mobile_verified" boolean NOT NULL DEFAULT false, "role_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "last_logged_in_at" TIMESTAMP WITH TIME ZONE, "password_updated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_USERS_MOBILE" UNIQUE ("mobile"), CONSTRAINT "UQ_USERS_EMAIL" UNIQUE ("email"), CONSTRAINT "CK_USERS_IDENTIFIER" CHECK (email IS NOT NULL OR mobile IS NOT NULL), CONSTRAINT "PK_USERS_ID" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_USERS_EMAIL" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_USERS_MOBILE" ON "users" ("mobile") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_USERS_MOBILE"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USERS_EMAIL"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "attachment_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ATTACHMENTS_UPLOADER_ID"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TYPE "public"."attachments_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "otp_logs"`);
        await queryRunner.query(`DROP TYPE "public"."otp_logs_reason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."otp_logs_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification_push_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."notification_push_tokens_provider_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_NOTIFICATIONS_STATUS"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_NOTIFICATIONS_USER_ID"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_alert_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_group_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    }

}
