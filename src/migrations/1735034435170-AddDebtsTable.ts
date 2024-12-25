import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddDebtsTable1735034435170 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'debts',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'reminder_id', type: 'varchar' },
          { name: 'debtor_id', type: 'varchar' },
          { name: 'amount', type: 'bigint' },
          { name: 'status', type: 'varchar' },
          { name: 'message', type: 'varchar', isNullable: true },
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
      'debts',
      new TableForeignKey({
        name: 'reminder_id_fk',
        columnNames: ['reminder_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_accounts',
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'debts',
      new TableForeignKey({
        name: 'debtor_id_fk',
        columnNames: ['debtor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bank_accounts',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('debts', 'reminder_id_fk');
    await queryRunner.dropForeignKey('debts', 'debtor_id_fk');
    await queryRunner.dropTable('debts');
  }
}
