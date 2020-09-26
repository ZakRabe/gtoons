import { MigrationInterface, QueryRunner } from 'typeorm';

export class User1601014847541 implements MigrationInterface {
  name = 'User1601014847541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   'DROP INDEX `IDX_9466682df91534dd95e4dbaa61` ON `user`'
    // );
    const profileLess = await queryRunner.query(
      'SELECT username FROM user WHERE profileId IS NULL'
    );
    for (const { username } of profileLess) {
      queryRunner.query(
        `INSERT INTO profile(displayName) VALUES('${username}')`
      );
    }
    if (profileLess.length) {
      const inString = `(${profileLess
        .map((x) => `'${x.username}'`)
        .join(',')})`;
      const ids = await queryRunner.query(
        `SELECT displayName, id FROM profile WHERE displayName IN ${inString}`
      );
      for (const { displayName, id } of ids) {
        if (!profileLess.find((profile) => profile.username === displayName)) {
          continue;
        }
        await queryRunner.query(
          `UPDATE user SET profileId = ${id} WHERE username = '${displayName}'`
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_9466682df91534dd95e4dbaa61` ON `user` (`profileId`)'
    );
    await queryRunner.query('UPDATE user SET profileId = NULL');
    await queryRunner.query('DELETE FROM profile');
  }
}
