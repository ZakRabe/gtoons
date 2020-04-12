import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLobbyTable1586646098121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`lobby` (  `id` INT NOT NULL AUTO_INCREMENT,  `name` VARCHAR(50) NOT NULL,  `created` DATETIME NULL DEFAULT NOW(),  `game_id` INT NULL,  `capacity` INT NULL DEFAULT 2,  `password` VARCHAR(255) NULL,  `owner_player_id` INT NOT NULL,  PRIMARY KEY (`id`),  INDEX `lobby_owner_fk_idx` (`owner_player_id` ASC),  INDEX `lobby_game_fk_idx` (`game_id` ASC),  CONSTRAINT `lobby_owner_fk`    FOREIGN KEY (`owner_player_id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `lobby_game_fk`    FOREIGN KEY (`game_id`)    REFERENCES `gtoons`.`game` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`lobby`;', undefined);
  }
}
