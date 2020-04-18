import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeatsToLobbyTable1587184316933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` ADD COLUMN `seat1_player_id` VARCHAR(45) NULL AFTER `owner_player_id`, ADD COLUMN `seat2_player_id` VARCHAR(45) NULL AFTER `seat1_player_id`, ADD COLUMN `seatRule` INT NULL DEFAULT 1 AFTER `seat2_player_id`, ADD UNIQUE INDEX `seat1_player_id_UNIQUE` (`seat1_player_id` ASC), ADD UNIQUE INDEX `seat2_player_id_UNIQUE` (`seat2_player_id` ASC);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` DROP COLUMN `seatRule`, DROP COLUMN `seat2_player_id`, DROP COLUMN `seat1_player_id`, DROP INDEX `seat2_player_id_UNIQUE` , DROP INDEX `seat1_player_id_UNIQUE` ;',
      undefined
    );
  }
}
