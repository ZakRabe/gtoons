import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLobbyTable1586646098121 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`lobby` (  `id` INT NOT NULL AUTO_INCREMENT,  `name` VARCHAR(50) NOT NULL,  `created` DATETIME NULL DEFAULT NOW(),  `gameId` INT NULL,  `capacity` INT NULL DEFAULT 2, `connectedCount` INT NULL DEFAULT 1,  `password` VARCHAR(255) NULL,  `ownerId` INT NOT NULL,  PRIMARY KEY (`id`),  INDEX `lobby_owner_fk_idx` (`ownerId` ASC),  INDEX `lobby_game_fk_idx` (`gameId` ASC),  CONSTRAINT `lobby_owner_fk`    FOREIGN KEY (`ownerId`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `lobby_game_fk`    FOREIGN KEY (`gameId`)    REFERENCES `gtoons`.`game` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`lobby`;', undefined);
  }
}
