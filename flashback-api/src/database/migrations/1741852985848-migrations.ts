import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741852985848 implements MigrationInterface {
    name = 'Migrations1741852985848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "filename" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "name" TO "filename"`);
    }

}
