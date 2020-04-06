import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeckTable1585885521685 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `gtoons`.`deck` (`id` INT NOT NULL AUTO_INCREMENT, `player_id` INT NOT NULL, `name` VARCHAR(45) NULL, `cards` VARCHAR(255) NULL, PRIMARY KEY (`id`), INDEX `player_id_fk_idx` (`player_id` ASC), CONSTRAINT `player_id_fk` FOREIGN KEY (`player_id`) REFERENCES `gtoons`.`user` (`id`) ON DELETE NO ACTION  ON UPDATE NO ACTION);',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`deck`;', undefined);
  }
}
