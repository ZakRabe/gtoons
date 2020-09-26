import {MigrationInterface, QueryRunner} from "typeorm";

export class Lobby1600928753494 implements MigrationInterface {
    name = 'Lobby1600928753494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lobby` ADD `lobbyPic` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `lobby` DROP COLUMN `lobbyPic`");
    }

}
