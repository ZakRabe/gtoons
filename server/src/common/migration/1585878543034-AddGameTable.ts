import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameTable1585878543034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`game` (  `id` INT NOT NULL AUTO_INCREMENT,  `player1Id` INT NOT NULL,  `player2Id` INT NULL,  `player1DeckId` INT NOT NULL,  `player2DeckId` INT NULL,  `color1` VARCHAR(45) NOT NULL,  `color2` VARCHAR(45) NULL,  `winnerId` INT NULL,  PRIMARY KEY (`id`),  INDEX `player1Id_fk_idx` (`player1Id` ASC),  INDEX `player2Id_fk_idx` (`player2Id` ASC),  INDEX `winnerId_fk_idx` (`winnerId` ASC),  CONSTRAINT `player1Id_fk`    FOREIGN KEY (`player1Id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `player2Id_fk`    FOREIGN KEY (`player2Id`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION,  CONSTRAINT `winnerId_fk`    FOREIGN KEY (`winnerId`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`game`;', undefined);
  }
}
