import { MigrationInterface, QueryRunner } from "typeorm";

export class Countries1709726777620 implements MigrationInterface {
    name = 'Countries1709726777620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "city_regions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city_id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_CITY_REGIONS" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "state_id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_CITIES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "iso3" character(3) NOT NULL, "iso2" character(2) NOT NULL, "numeric_code" character(3) NOT NULL, "phone_code" character varying NOT NULL, "currency" character varying NOT NULL, "currency_name" character varying NOT NULL, "currency_symbol" character varying NOT NULL, "native" character varying, "region" character varying NOT NULL, "subregion" character varying NOT NULL, "nationality" character varying NOT NULL, "timezones" jsonb, "translations" jsonb NOT NULL, "emoji" character varying NOT NULL, "emojiU" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_COUNTRIES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "states" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country_id" uuid NOT NULL, "name" character varying NOT NULL, "state_code" character varying NOT NULL, "type" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_STATES" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "city_regions" ADD CONSTRAINT "FK_CITY_REGIONS_CITIES_ID" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_CITIES_STATES_ID" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "states" ADD CONSTRAINT "FK_STATES_COUNTRIES_ID" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "states" DROP CONSTRAINT "FK_STATES_COUNTRIES_ID"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_CITIES_STATES_ID"`);
        await queryRunner.query(`ALTER TABLE "city_regions" DROP CONSTRAINT "FK_CITY_REGIONS_CITIES_ID"`);
        await queryRunner.query(`DROP TABLE "states"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "cities"`);
        await queryRunner.query(`DROP TABLE "city_regions"`);
    }

}
