import {MigrationInterface, QueryRunner} from "typeorm";

export class Collection1600406666974 implements MigrationInterface {
    name = 'Collection1600406666974'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `collection` DROP COLUMN `cards`");
        await queryRunner.query("ALTER TABLE `collection` ADD `cards` mediumtext NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `collection` DROP COLUMN `cards`");
        await queryRunner.query("ALTER TABLE `collection` ADD `cards` varchar(255) NOT NULL");
    }

}
