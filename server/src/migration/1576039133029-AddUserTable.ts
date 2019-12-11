import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTable1576039133029 implements MigrationInterface {
    name = 'AddUserTable1576039133029'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `id_UNIQUE` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `username_UNIQUE` ON `user`", undefined);
        await queryRunner.query("DROP INDEX `email_UNIQUE` ON `user`", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `username`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `username` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `email`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `email` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `password`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `password` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `created`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `created` varchar(255) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `created`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `password`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `password` varchar(200) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `email`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `email` varchar(100) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `username`", undefined);
        await queryRunner.query("ALTER TABLE `user` ADD `username` varchar(100) NOT NULL", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `email_UNIQUE` ON `user` (`email`)", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `username_UNIQUE` ON `user` (`username`)", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `id_UNIQUE` ON `user` (`id`)", undefined);
    }

}
