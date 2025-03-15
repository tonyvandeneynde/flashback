import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1742033110449 implements MigrationInterface {
    name = 'Migrations1742033110449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "addedByUser" TO "addedByUserEmail"`);
        await queryRunner.query(`ALTER TABLE "image" ADD CONSTRAINT "FK_ea6d58f3e402849dab2caef768a" FOREIGN KEY ("addedByUserEmail") REFERENCES "user"("email") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_ea6d58f3e402849dab2caef768a"`);
        await queryRunner.query(`ALTER TABLE "image" RENAME COLUMN "addedByUserEmail" TO "addedByUser"`);
    }

}
