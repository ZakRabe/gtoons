import {MigrationInterface, QueryRunner} from "typeorm";

export class User1601004358273 implements MigrationInterface {
    name = 'User1601004358273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `profile` (`id` int NOT NULL AUTO_INCREMENT, `displayName` varchar(255) NOT NULL, `title` varchar(255) NULL, `profilePic` varchar(255) NULL, `profilePicType` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `profilePic`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `profilePicType`");
        await queryRunner.query("ALTER TABLE `user` ADD `profileId` int NULL");
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_9466682df91534dd95e4dbaa61` (`profileId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_9466682df91534dd95e4dbaa61` ON `user` (`profileId`)");
        await queryRunner.query("ALTER TABLE `user` ADD CONSTRAINT `FK_9466682df91534dd95e4dbaa616` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP FOREIGN KEY `FK_9466682df91534dd95e4dbaa616`");
        await queryRunner.query("DROP INDEX `REL_9466682df91534dd95e4dbaa61` ON `user`");
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_9466682df91534dd95e4dbaa61`");
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `profileId`");
        await queryRunner.query("ALTER TABLE `user` ADD `profilePicType` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `user` ADD `profilePic` varchar(255) NULL");
        await queryRunner.query("DROP TABLE `profile`");
    }

}
