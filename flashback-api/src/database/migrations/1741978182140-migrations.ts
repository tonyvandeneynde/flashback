import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741978182140 implements MigrationInterface {
    name = 'Migrations1741978182140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "addedByUserId" TO "addedByUser"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "addedByUser"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "addedByUser" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "addedByUser"`);
        await queryRunner.query(`ALTER TABLE "image" ADD "addedByUser" integer`);
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "addedByUser" TO "addedByUserId"`);
    }

}
