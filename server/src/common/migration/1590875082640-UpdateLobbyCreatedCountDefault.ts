import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLobbyCreatedCountDefault1590875082640
  implements MigrationInterface {
  // update from 1 to 0
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `gtoons`.`lobby` CHANGE COLUMN `connectedCount` `connectedCount` INT(11) NULL DEFAULT '0' ;",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `gtoons`.`lobby` CHANGE COLUMN `connectedCount` `connectedCount` INT(11) NULL DEFAULT '1' ;",
      undefined
    );
  }
}
