import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741804226647 implements MigrationInterface {
    name = 'Migrations1741804226647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image_tags_tag" ("imageId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_25c79814df1c64505a94e1c9a11" PRIMARY KEY ("imageId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb0a8276058d9d4747e9d7b0ea" ON "image_tags_tag" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a314e4dc3f17751aaf35c12c68" ON "image_tags_tag" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "image_tags_tag" ADD CONSTRAINT "FK_fb0a8276058d9d4747e9d7b0ea1" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "image_tags_tag" ADD CONSTRAINT "FK_a314e4dc3f17751aaf35c12c681" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_tags_tag" DROP CONSTRAINT "FK_a314e4dc3f17751aaf35c12c681"`);
        await queryRunner.query(`ALTER TABLE "image_tags_tag" DROP CONSTRAINT "FK_fb0a8276058d9d4747e9d7b0ea1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a314e4dc3f17751aaf35c12c68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb0a8276058d9d4747e9d7b0ea"`);
        await queryRunner.query(`DROP TABLE "image_tags_tag"`);
        await queryRunner.query(`DROP TABLE "tag"`);
    }

}
