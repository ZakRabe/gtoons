import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameTable1585878543034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`game` (  `id` INT NOT NULL AUTO_INCREMENT,  `player1_id` INT NOT NULL,  `player2_id` INT NULL,  `player1Deck_id` INT NOT NULL,  `player2Deck_id` INT NULL,  `color1` VARCHAR(45) NOT NULL,  `color2` VARCHAR(45) NULL,  `winner_id` INT NULL,  PRIMARY KEY (`id`),  INDEX `player1_id_fk_idx` (`player1_id` ASC),  INDEX `player2_id_fk_idx` (`player2_id` ASC),  INDEX `winner_id_fk_idx` (`winner_id` ASC),  CONSTRAINT `player1_id_fk`    FOREIGN KEY (`player1_id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `player2_id_fk`    FOREIGN KEY (`player2_id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `winner_id_fk`    FOREIGN KEY (`winner_id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`game`;', undefined);
  }
}
