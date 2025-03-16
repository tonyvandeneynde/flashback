import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742121975422 implements MigrationInterface {
    name = 'Migrations1742121975422'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "gallery" ALTER COLUMN "deletedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ALTER COLUMN "deletedAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gallery" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

}
