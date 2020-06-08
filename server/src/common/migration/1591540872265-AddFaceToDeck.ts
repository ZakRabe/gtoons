import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFaceToDeck1591540872265 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `gtoons`.`deck` ADD COLUMN `face` INT;', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `gtoons`.`deck` DROP COLUMN `face`', undefined);
  }

}
