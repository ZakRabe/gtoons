import {MigrationInterface, QueryRunner} from "typeorm";

export class LongTextCollection1600548104241 implements MigrationInterface {
    name = 'LongTextCollection1600548104241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `collection` DROP COLUMN `cards`");
        await queryRunner.query("ALTER TABLE `collection` ADD `cards` longtext NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `collection` DROP COLUMN `cards`");
        await queryRunner.query("ALTER TABLE `collection` ADD `cards` varchar(255) NOT NULL");
    }

}
