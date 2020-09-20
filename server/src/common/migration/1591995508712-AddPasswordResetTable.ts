import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetTable1591995508712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `gtoons`.`pw_reset` (`id` INT NOT NULL AUTO_INCREMENT,`userId` INT NOT NULL,`token` VARCHAR(45) NOT NULL,PRIMARY KEY (`id`),UNIQUE INDEX `userId_UNIQUE` (`userId` ASC),UNIQUE INDEX `token_UNIQUE` (`token` ASC),CONSTRAINT `pw_reset_user`FOREIGN KEY (`userId`)REFERENCES `gtoons`.`user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) COMMENT = 'table for pasword reset tokens';",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `gtoons`.`pw_reset`;', undefined);
  }
}
