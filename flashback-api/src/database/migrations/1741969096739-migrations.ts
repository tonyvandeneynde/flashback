import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741969096739 implements MigrationInterface {
    name = 'Migrations1741969096739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "accountId" integer`);
        await queryRunner.query(`ALTER TABLE "image" ADD "addedByUserId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "addedByUserId"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "accountId"`);
    }

}
