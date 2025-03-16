import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742040444516 implements MigrationInterface {
    name = 'Migrations1742040444516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "parentId" integer, CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gallery" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "folderId" integer, CONSTRAINT "PK_65d7a1ef91ddafb3e7071b188a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image" ADD "galleryId" integer`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "FK_9ee3bd0f189fb242d488c0dfa39" FOREIGN KEY ("parentId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD CONSTRAINT "FK_681a220de43cfd71c5eec084816" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_db76f1359fbcb0d29d9e4e2bbdf" FOREIGN KEY ("galleryId") REFERENCES "gallery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_db76f1359fbcb0d29d9e4e2bbdf"`);
        await queryRunner.query(`ALTER TABLE "gallery" DROP CONSTRAINT "FK_681a220de43cfd71c5eec084816"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "FK_9ee3bd0f189fb242d488c0dfa39"`);
        await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "galleryId"`);
        await queryRunner.query(`DROP TABLE "gallery"`);
        await queryRunner.query(`DROP TABLE "folder"`);
    }

}
