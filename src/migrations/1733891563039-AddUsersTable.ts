import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddUsersTable1733891563039 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
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

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'users_created_by_fk',
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'users_created_by_fk');
    await queryRunner.dropTable('users');
  }
}
