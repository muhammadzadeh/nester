import { MigrationInterface, QueryRunner } from "typeorm";

export class Countries1709562376453 implements MigrationInterface {
    name = 'Countries1709562376453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state_id" uuid NOT NULL, "name" character varying NOT NULL, "latitude" numeric(14,10), "longitude" numeric(14,10), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_CITIES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_id" uuid NOT NULL, "name" character varying NOT NULL, "state_code" character varying NOT NULL, "latitude" numeric(14,10), "longitude" numeric(14,10), "type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_STATES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "iso3" character(3) NOT NULL, "iso2" character(2) NOT NULL, "numeric_code" character(3) NOT NULL, "phone_code" character varying NOT NULL, "capital" character varying NOT NULL, "currency" character varying NOT NULL, "currency_name" character varying NOT NULL, "currency_symbol" character varying NOT NULL, "tld" character varying NOT NULL, "native" character varying, "region" character varying NOT NULL, "region_id" integer, "subregion" character varying NOT NULL, "subregion_id" integer, "nationality" character varying NOT NULL, "timezones" jsonb, "translations" jsonb NOT NULL, "latitude" numeric(14,10), "longitude" numeric(14,10), "emoji" character varying NOT NULL, "emojiU" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_COUNTRIES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_CITIES_STATES_ID" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_STATES_COUNTRIES" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_STATES_COUNTRIES"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_CITIES_STATES_ID"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "states"`);
        await queryRunner.query(`DROP TABLE "cities"`);
    }

}
