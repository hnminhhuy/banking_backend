import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddUsersTable1733891563039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'created_by', type: 'uuid', isNullable: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'is_active', type: 'boolean', default: false },
          { name: 'fullname', type: 'varchar' },
          { name: 'role', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'NOW()' },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'NOW()',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('users');
  }
}
