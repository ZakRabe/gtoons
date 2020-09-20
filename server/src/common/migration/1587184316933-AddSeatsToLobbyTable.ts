import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeatsToLobbyTable1587184316933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` ADD COLUMN `seat1Id` VARCHAR(45) NULL AFTER `ownerId`, ADD COLUMN `seat2Id` VARCHAR(45) NULL AFTER `seat1Id`, ADD COLUMN `seatRule` INT NULL DEFAULT 1 AFTER `seat2Id`, ADD UNIQUE INDEX `seat1Id_UNIQUE` (`seat1Id` ASC), ADD UNIQUE INDEX `seat2Id_UNIQUE` (`seat2Id` ASC);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` DROP COLUMN `seatRule`, DROP COLUMN `seat2Id`, DROP COLUMN `seat1Id`, DROP INDEX `seat2Id_UNIQUE` , DROP INDEX `seat1Id_UNIQUE` ;',
      undefined
    );
  }
}
