import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCollectionTable1585886663247 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`collection` (  `id` INT NOT NULL AUTO_INCREMENT,  `playerId` INT NOT NULL,  `cards` MEDIUMTEXT NOT NULL,  UNIQUE INDEX `playerId_UNIQUE` (`playerId` ASC),  PRIMARY KEY (`id`),  CONSTRAINT `collectionPlayerId_fk`    FOREIGN KEY (`playerId`)    REFERENCES `gtoons`.`user` (`id`)    ON DELETE NO ACTION    ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`collection`;', undefined);
  }
}
