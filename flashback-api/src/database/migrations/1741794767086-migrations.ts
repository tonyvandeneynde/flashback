import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741794767086 implements MigrationInterface {
    name = 'Migrations1741794767086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "filename" character varying NOT NULL, "originalPath" character varying NOT NULL, "mediumPath" character varying NOT NULL, "thumbnailPath" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
