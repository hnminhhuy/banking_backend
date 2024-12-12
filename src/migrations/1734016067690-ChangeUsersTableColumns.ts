import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUsersTableColumns1734016067690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('users', 'is_active', 'is_blocked');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
