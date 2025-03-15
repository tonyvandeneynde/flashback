import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742037010685 implements MigrationInterface {
    name = 'Migrations1742037010685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_a545efe23a364937bf87df57539" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_a545efe23a364937bf87df57539"`);
    }

}
