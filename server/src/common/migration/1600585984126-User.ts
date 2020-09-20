import {MigrationInterface, QueryRunner} from "typeorm";

export class User1600585984126 implements MigrationInterface {
    name = 'User1600585984126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_a9a00111ab551cb105465fce25` ON `collection`");
        await queryRunner.query("DROP INDEX `IDX_fcd3a7bc021f6846ffe6e6fbfb` ON `deck`");
        await queryRunner.query("DROP INDEX `IDX_ff1f3ba7eb0bdd65c150a8ea1d` ON `gamestate`");
        await queryRunner.query("DROP INDEX `IDX_7b7f91302f66ab534423c96aa3` ON `game`");
        await queryRunner.query("DROP INDEX `IDX_3b85329cbe5b9f9002f05018fa` ON `game`");
        await queryRunner.query("DROP INDEX `IDX_7ffaab31f30d682b4e22a4a055` ON `game`");
        await queryRunner.query("DROP INDEX `IDX_08a696fb851dfa3f579e621c60` ON `game`");
        await queryRunner.query("DROP INDEX `IDX_cd57acb58d1147c23da5cd09ca` ON `game`");
        await queryRunner.query("DROP INDEX `IDX_9248271fd0074cad6e0dfd83f9` ON `lobby`");
        await queryRunner.query("DROP INDEX `IDX_62cf2a65f7f4d65d65015e56d1` ON `lobby`");
        await queryRunner.query("DROP INDEX `IDX_679afaf055e3e5d2b2f3ac14de` ON `lobby`");
        await queryRunner.query("DROP INDEX `IDX_427b7cf6b08e26308e2c815526` ON `lobby`");
        await queryRunner.query("DROP INDEX `IDX_9c989fbbc6b7314dbca24cf49a` ON `pw_reset`");
        await queryRunner.query("ALTER TABLE `user` ADD `profilePicType` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP COLUMN `profilePicType`");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_9c989fbbc6b7314dbca24cf49a` ON `pw_reset` (`userId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_427b7cf6b08e26308e2c815526` ON `lobby` (`seat2Id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_679afaf055e3e5d2b2f3ac14de` ON `lobby` (`seat1Id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_62cf2a65f7f4d65d65015e56d1` ON `lobby` (`ownerId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_9248271fd0074cad6e0dfd83f9` ON `lobby` (`gameId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_cd57acb58d1147c23da5cd09ca` ON `game` (`winnerId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_08a696fb851dfa3f579e621c60` ON `game` (`player2DeckId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_7ffaab31f30d682b4e22a4a055` ON `game` (`player1DeckId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_3b85329cbe5b9f9002f05018fa` ON `game` (`player2Id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_7b7f91302f66ab534423c96aa3` ON `game` (`player1Id`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_ff1f3ba7eb0bdd65c150a8ea1d` ON `gamestate` (`gameId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_fcd3a7bc021f6846ffe6e6fbfb` ON `deck` (`playerId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_a9a00111ab551cb105465fce25` ON `collection` (`playerId`)");
    }

}
