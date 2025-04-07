import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744017138029 implements MigrationInterface {
  name = 'Migrations1744017138029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gallery" ADD "showMapInGallery" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gallery" DROP COLUMN "showMapInGallery"`,
    );
  }
}
