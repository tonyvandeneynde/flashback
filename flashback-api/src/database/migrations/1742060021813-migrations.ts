import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742060021813 implements MigrationInterface {
    name = 'Migrations1742060021813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" ADD "accountId" integer`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_d6bab00e8122f99abed46c79007" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_d6bab00e8122f99abed46c79007"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "accountId"`);
    }

}
