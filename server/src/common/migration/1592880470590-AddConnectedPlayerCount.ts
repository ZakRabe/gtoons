import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConnectedPlayerCount1592880470590
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`gameState` ADD COLUMN `connectedPlayers` INT(11) NULL DEFAULT 0 AFTER `player2ShuffledDeck`;',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`gameState` DROP COLUMN `connectedPlayers`;',
      undefined
    );
  }
}
