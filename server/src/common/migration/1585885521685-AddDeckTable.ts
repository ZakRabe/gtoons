import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeckTable1585885521685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`deck` (`id` INT NOT NULL AUTO_INCREMENT, `playerId` INT NOT NULL, `name` VARCHAR(45) NULL, `cards` VARCHAR(255) NULL, PRIMARY KEY (`id`), INDEX `playerId_fk_idx` (`playerId` ASC), CONSTRAINT `playerId_fk` FOREIGN KEY (`playerId`) REFERENCES `gtoons`.`user` (`id`) ON DELETE NO ACTION  ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`deck`;', undefined);
  }
}
