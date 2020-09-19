import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerateInitialDB1600537843778 implements MigrationInterface {
    name = 'GenerateInitialDB1600537843778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `salt` varchar(255) NOT NULL, `role` varchar(255) NOT NULL DEFAULT 'PLAYER', `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `collection` (`id` int NOT NULL AUTO_INCREMENT, `cards` varchar(255) NOT NULL, `playerId` int NULL, UNIQUE INDEX `REL_a9a00111ab551cb105465fce25` (`playerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `deck` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `cards` varchar(255) NOT NULL, `face` int NOT NULL, `playerId` int NULL, UNIQUE INDEX `REL_fcd3a7bc021f6846ffe6e6fbfb` (`playerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `gamestate` (`id` int NOT NULL AUTO_INCREMENT, `turn` int NOT NULL DEFAULT 0, `player1Board` varchar(255) NOT NULL DEFAULT '[]', `player2Board` varchar(255) NOT NULL DEFAULT '[]', `player1Discard` varchar(255) NOT NULL DEFAULT '[]', `player2Discard` varchar(255) NOT NULL DEFAULT '[]', `player1ShuffledDeck` varchar(255) NOT NULL DEFAULT '[]', `player2ShuffledDeck` varchar(255) NOT NULL DEFAULT '[]', `connectedPlayers` int NOT NULL DEFAULT 0, `gameId` int NULL, UNIQUE INDEX `REL_ff1f3ba7eb0bdd65c150a8ea1d` (`gameId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `game` (`id` int NOT NULL AUTO_INCREMENT, `color1` varchar(255) NOT NULL, `color2` varchar(255) NULL, `player1Id` int NULL, `player2Id` int NULL, `player1DeckId` int NULL, `player2DeckId` int NULL, `winnerId` int NULL, UNIQUE INDEX `REL_7b7f91302f66ab534423c96aa3` (`player1Id`), UNIQUE INDEX `REL_3b85329cbe5b9f9002f05018fa` (`player2Id`), UNIQUE INDEX `REL_7ffaab31f30d682b4e22a4a055` (`player1DeckId`), UNIQUE INDEX `REL_08a696fb851dfa3f579e621c60` (`player2DeckId`), UNIQUE INDEX `REL_cd57acb58d1147c23da5cd09ca` (`winnerId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `lobby` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `created` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `capacity` int NOT NULL, `connectedCount` int NOT NULL DEFAULT 0, `seat1Ready` tinyint NOT NULL DEFAULT 0, `seat2Ready` tinyint NOT NULL DEFAULT 0, `seatRule` int NOT NULL DEFAULT 0, `password` varchar(255) NULL, `gameId` int NULL, `ownerId` int NULL, `seat1Id` int NULL, `seat2Id` int NULL, `seat1DeckId` int NULL, `seat2DeckId` int NULL, UNIQUE INDEX `REL_9248271fd0074cad6e0dfd83f9` (`gameId`), UNIQUE INDEX `REL_62cf2a65f7f4d65d65015e56d1` (`ownerId`), UNIQUE INDEX `REL_679afaf055e3e5d2b2f3ac14de` (`seat1Id`), UNIQUE INDEX `REL_427b7cf6b08e26308e2c815526` (`seat2Id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `pw_reset` (`id` int NOT NULL AUTO_INCREMENT, `token` varchar(255) NOT NULL, `userId` int NULL, UNIQUE INDEX `REL_9c989fbbc6b7314dbca24cf49a` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `collection` ADD CONSTRAINT `FK_a9a00111ab551cb105465fce254` FOREIGN KEY (`playerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `deck` ADD CONSTRAINT `FK_fcd3a7bc021f6846ffe6e6fbfb7` FOREIGN KEY (`playerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `gamestate` ADD CONSTRAINT `FK_ff1f3ba7eb0bdd65c150a8ea1d3` FOREIGN KEY (`gameId`) REFERENCES `game`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `game` ADD CONSTRAINT `FK_7b7f91302f66ab534423c96aa34` FOREIGN KEY (`player1Id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `game` ADD CONSTRAINT `FK_3b85329cbe5b9f9002f05018faf` FOREIGN KEY (`player2Id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `game` ADD CONSTRAINT `FK_7ffaab31f30d682b4e22a4a055b` FOREIGN KEY (`player1DeckId`) REFERENCES `deck`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `game` ADD CONSTRAINT `FK_08a696fb851dfa3f579e621c609` FOREIGN KEY (`player2DeckId`) REFERENCES `deck`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `game` ADD CONSTRAINT `FK_cd57acb58d1147c23da5cd09cae` FOREIGN KEY (`winnerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_9248271fd0074cad6e0dfd83f9d` FOREIGN KEY (`gameId`) REFERENCES `game`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_62cf2a65f7f4d65d65015e56d15` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_679afaf055e3e5d2b2f3ac14dec` FOREIGN KEY (`seat1Id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_427b7cf6b08e26308e2c8155261` FOREIGN KEY (`seat2Id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_48b53966e10d928dc4c2176d129` FOREIGN KEY (`seat1DeckId`) REFERENCES `deck`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `lobby` ADD CONSTRAINT `FK_27118cca0a1d88c1ce5d85f4e5b` FOREIGN KEY (`seat2DeckId`) REFERENCES `deck`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `pw_reset` ADD CONSTRAINT `FK_9c989fbbc6b7314dbca24cf49a2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `pw_reset` DROP FOREIGN KEY `FK_9c989fbbc6b7314dbca24cf49a2`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_27118cca0a1d88c1ce5d85f4e5b`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_48b53966e10d928dc4c2176d129`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_427b7cf6b08e26308e2c8155261`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_679afaf055e3e5d2b2f3ac14dec`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_62cf2a65f7f4d65d65015e56d15`");
        await queryRunner.query("ALTER TABLE `lobby` DROP FOREIGN KEY `FK_9248271fd0074cad6e0dfd83f9d`");
        await queryRunner.query("ALTER TABLE `game` DROP FOREIGN KEY `FK_cd57acb58d1147c23da5cd09cae`");
        await queryRunner.query("ALTER TABLE `game` DROP FOREIGN KEY `FK_08a696fb851dfa3f579e621c609`");
        await queryRunner.query("ALTER TABLE `game` DROP FOREIGN KEY `FK_7ffaab31f30d682b4e22a4a055b`");
        await queryRunner.query("ALTER TABLE `game` DROP FOREIGN KEY `FK_3b85329cbe5b9f9002f05018faf`");
        await queryRunner.query("ALTER TABLE `game` DROP FOREIGN KEY `FK_7b7f91302f66ab534423c96aa34`");
        await queryRunner.query("ALTER TABLE `gamestate` DROP FOREIGN KEY `FK_ff1f3ba7eb0bdd65c150a8ea1d3`");
        await queryRunner.query("ALTER TABLE `deck` DROP FOREIGN KEY `FK_fcd3a7bc021f6846ffe6e6fbfb7`");
        await queryRunner.query("ALTER TABLE `collection` DROP FOREIGN KEY `FK_a9a00111ab551cb105465fce254`");
        await queryRunner.query("DROP INDEX `REL_9c989fbbc6b7314dbca24cf49a` ON `pw_reset`");
        await queryRunner.query("DROP TABLE `pw_reset`");
        await queryRunner.query("DROP INDEX `REL_427b7cf6b08e26308e2c815526` ON `lobby`");
        await queryRunner.query("DROP INDEX `REL_679afaf055e3e5d2b2f3ac14de` ON `lobby`");
        await queryRunner.query("DROP INDEX `REL_62cf2a65f7f4d65d65015e56d1` ON `lobby`");
        await queryRunner.query("DROP INDEX `REL_9248271fd0074cad6e0dfd83f9` ON `lobby`");
        await queryRunner.query("DROP TABLE `lobby`");
        await queryRunner.query("DROP INDEX `REL_cd57acb58d1147c23da5cd09ca` ON `game`");
        await queryRunner.query("DROP INDEX `REL_08a696fb851dfa3f579e621c60` ON `game`");
        await queryRunner.query("DROP INDEX `REL_7ffaab31f30d682b4e22a4a055` ON `game`");
        await queryRunner.query("DROP INDEX `REL_3b85329cbe5b9f9002f05018fa` ON `game`");
        await queryRunner.query("DROP INDEX `REL_7b7f91302f66ab534423c96aa3` ON `game`");
        await queryRunner.query("DROP TABLE `game`");
        await queryRunner.query("DROP INDEX `REL_ff1f3ba7eb0bdd65c150a8ea1d` ON `gamestate`");
        await queryRunner.query("DROP TABLE `gamestate`");
        await queryRunner.query("DROP INDEX `REL_fcd3a7bc021f6846ffe6e6fbfb` ON `deck`");
        await queryRunner.query("DROP TABLE `deck`");
        await queryRunner.query("DROP INDEX `REL_a9a00111ab551cb105465fce25` ON `collection`");
        await queryRunner.query("DROP TABLE `collection`");
        await queryRunner.query("DROP TABLE `user`");
    }

}
