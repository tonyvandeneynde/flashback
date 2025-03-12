import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741806306675 implements MigrationInterface {
    name = 'Migrations1741806306675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "image" ADD "latitude" character varying`);
        await queryRunner.query(`ALTER TABLE "image" ADD "longitude" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "date"`);
    }

}
