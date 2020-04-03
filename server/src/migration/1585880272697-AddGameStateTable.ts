import {MigrationInterface, QueryRunner} from "typeorm";

export class AddGameStateTable1585880272697 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `gtoons`.`gameState` (`id` INT NOT NULL, `game_id` INT NOT NULL, `turn` INT NOT NULL, `player1Board` VARCHAR(255) NOT NULL, `player2Board` VARCHAR(255) NOT NULL, `player1Discard` VARCHAR(45) NULL, `player2Discard` VARCHAR(45) NULL, `player1ShuffledDeck` VARCHAR(255) NOT NULL, `player2ShuffledDeck` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `game_id_UNIQUE` (`game_id` ASC), CONSTRAINT `game_id_fk` FOREIGN KEY (`game_id`) REFERENCES `gtoons`.`game` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION);',
        undefined)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `gtoons`.`gameState`;',
        undefined)
    }

}
