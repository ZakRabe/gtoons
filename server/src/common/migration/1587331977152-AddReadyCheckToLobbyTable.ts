import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadyCheckToLobbyTable1587331977152
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` ADD COLUMN `seat1Ready` INT NULL DEFAULT 0 AFTER `seatRule`, ADD COLUMN `seat2Ready` INT NULL DEFAULT 0 AFTER `seat1Ready`;',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` DROP COLUMN `seat2Ready`,DROP COLUMN `seat1Ready`;',
      undefined
    );
  }
}
