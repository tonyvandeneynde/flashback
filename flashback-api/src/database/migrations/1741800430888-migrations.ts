import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741800430888 implements MigrationInterface {
    name = 'Migrations1741800430888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "image" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "createdAt"`);
    }

}
