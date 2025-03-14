import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741895114948 implements MigrationInterface {
    name = 'Migrations1741895114948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_c29e36fd94b1a548b3596d69a6e"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "primaryUserEmail"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "primaryUserEmail" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_c29e36fd94b1a548b3596d69a6e" FOREIGN KEY ("primaryUserEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
