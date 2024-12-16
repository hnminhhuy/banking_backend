import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AddTransactionTable1734248595606 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'remitter_id',
            type: 'varchar',
          },
          {
            name: 'beneficiary_id',
            type: 'varchar',
          },
          {
            name: 'beneficiary_name',
            type: 'varchar',
          },
          {
            name: 'beneficiary_bank_id',
            type: 'uuid',
          },
          {
            name: 'amount',
            type: 'bigint',
          },
          // Them dept sau
          {
            name: 'message',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'transaction_fee',
            type: 'bigint',
          },
          {
            name: 'remitter_paid_fee',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['remitter_id'],
        referencedTableName: 'bank_accounts',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['beneficiary_bank_id'],
        referencedTableName: 'banks',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');

    if (table) {
      const foreignKeys = table.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('transactions', foreignKey);
      }
    }

    await queryRunner.dropTable('transactions');
  }
}
