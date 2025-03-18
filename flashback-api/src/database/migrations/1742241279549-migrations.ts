import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742241279549 implements MigrationInterface {
    name = 'Migrations1742241279549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "width" integer`);
        await queryRunner.query(`ALTER TABLE "image" ADD "height" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "width"`);
    }

}
