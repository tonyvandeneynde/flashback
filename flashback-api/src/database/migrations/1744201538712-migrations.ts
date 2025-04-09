import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1744201538712 implements MigrationInterface {
    name = 'Migrations1744201538712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" ADD "showMapInFolder" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "showMapInFolder"`);
    }

}
