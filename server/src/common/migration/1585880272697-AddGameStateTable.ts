import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameStateTable1585880272697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`gameState` (`id` INT NOT NULL AUTO_INCREMENT, `gameId` INT NOT NULL, `turn` INT NOT NULL, `player1Board` VARCHAR(255) NOT NULL, `player2Board` VARCHAR(255) NOT NULL, `player1Discard` VARCHAR(45) NULL, `player2Discard` VARCHAR(45) NULL, `player1ShuffledDeck` VARCHAR(255) NOT NULL, `player2ShuffledDeck` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `gameId_UNIQUE` (`gameId` ASC), CONSTRAINT `gameId_fk` FOREIGN KEY (`gameId`) REFERENCES `gtoons`.`game` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`gameState`;', undefined);
  }
}
