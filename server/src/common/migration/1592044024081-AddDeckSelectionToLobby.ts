import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeckSelectionToLobby1592044024081
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` ADD COLUMN `seat1DeckId` INT(11) NULL AFTER `seat2Ready`, ADD COLUMN `seat2DeckId` INT(11) NULL AFTER `seat1DeckId`;',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`lobby` DROP COLUMN `seat2DeckId`, DROP COLUMN `seat1DeckId`;',
      undefined
    );
  }
}
