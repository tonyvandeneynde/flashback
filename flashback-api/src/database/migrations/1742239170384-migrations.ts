import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742239170384 implements MigrationInterface {
    name = 'Migrations1742239170384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "latitudeRef" character varying`);
        await queryRunner.query(`ALTER TABLE "image" ADD "longitudeRef" character varying`);
        await queryRunner.query(`ALTER TABLE "image" ADD "orientation" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "orientation"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "longitudeRef"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "latitudeRef"`);
    }

}
