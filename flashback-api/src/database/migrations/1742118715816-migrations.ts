import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742118715816 implements MigrationInterface {
    name = 'Migrations1742118715816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ADD "createdAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "deletedAt" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "accountId" integer`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD CONSTRAINT "FK_f0853dd97ed097fb3dbe80c76b5" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP CONSTRAINT "FK_f0853dd97ed097fb3dbe80c76b5"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "createdAt"`);
    }

}
