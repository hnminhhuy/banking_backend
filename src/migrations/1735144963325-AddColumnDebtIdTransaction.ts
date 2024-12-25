import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddColumnDebtIdTransaction1735144963325
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'debt_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['debt_id'],
        referencedTableName: 'debts',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('debt_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('transactions', foreignKey);
    }

    // Drop the column
    await queryRunner.dropColumn('transactions', 'debt_id');
  }
}
