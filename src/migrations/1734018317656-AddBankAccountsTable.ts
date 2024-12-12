import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddBankAccountsTable1734018317656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the bank_accounts table
    await queryRunner.createTable(
      new Table({
        name: 'bank_accounts',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'bank_id',
            type: 'uuid',
          },
          {
            name: 'balance',
            type: 'bigint',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'NOW()',
          },
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
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    );

    await queryRunner.createForeignKey(
      'bank_accounts',
      new TableForeignKey({
        columnNames: ['bank_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'banks',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable('bank_accounts');
    if (table) {
      const foreignKeys = table.foreignKeys.filter(
        (fk) =>
          fk.columnNames.includes('user_id') ||
          fk.columnNames.includes('bank_id'),
      );
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('bank_accounts', foreignKey);
      }
    }

    await queryRunner.dropTable('bank_accounts');
  }
}
