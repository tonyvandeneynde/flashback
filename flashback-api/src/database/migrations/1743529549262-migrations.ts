import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1743529549262 implements MigrationInterface {
    name = 'Migrations1743529549262'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ADD "coverImageId" integer`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "showImagesOnParentFolderMaps" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "showImagesOnParentFolderMaps"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "coverImageId"`);
    }

}
