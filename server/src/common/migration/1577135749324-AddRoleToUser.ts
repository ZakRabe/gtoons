import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleToUser1577135749324 implements MigrationInterface {
  name = 'AddRoleToUser1577135749324';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `gtoons`.`user` ADD COLUMN `role` VARCHAR(45) AFTER `salt`;',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `user` DROP COLUMN `role`', undefined);
  }
}
