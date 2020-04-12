import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordSaltToUsers1576862017684 implements MigrationInterface {
  name = 'AddPasswordSaltToUsers1576862017684';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`user` ADD COLUMN `salt` VARCHAR(16) NOT NULL AFTER `created`;',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`user` DROP COLUMN `salt`',
      undefined
    );
  }
}
