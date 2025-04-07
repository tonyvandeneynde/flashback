import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743530502867 implements MigrationInterface {
    name = 'Migrations1743530502867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ADD CONSTRAINT "UQ_5e27d5441af06a266d8c3eceaa5" UNIQUE ("coverImageId")`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD CONSTRAINT "FK_5e27d5441af06a266d8c3eceaa5" FOREIGN KEY ("coverImageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP CONSTRAINT "FK_5e27d5441af06a266d8c3eceaa5"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP CONSTRAINT "UQ_5e27d5441af06a266d8c3eceaa5"`);
    }

}
