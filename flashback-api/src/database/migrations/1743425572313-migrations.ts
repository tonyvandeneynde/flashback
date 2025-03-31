import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743425572313 implements MigrationInterface {
    name = 'Migrations1743425572313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ADD "picture" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
