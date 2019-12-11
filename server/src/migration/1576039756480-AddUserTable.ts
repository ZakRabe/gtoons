import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1576039756480 implements MigrationInterface {
  name = "AddUserTable1576039756480";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`), UNIQUE INDEX `username_UNIQUE` (`username` ASC), UNIQUE INDEX `email_UNIQUE` (`email` ASC)) ENGINE=InnoDB",
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE `user`", undefined);
  }
}
