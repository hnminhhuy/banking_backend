import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeTransactionTableColumn1736262952592
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transactions',
      'created_at',
      new TableColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.changeColumn(
      'transactions',
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.changeColumn(
      'transactions',
      'completed_at',
      new TableColumn({
        name: 'completed_at',
        type: 'timestamptz',
        isNullable: true,
        default: null,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'transactions',
      'created_at',
      new TableColumn({
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      }),
    );

    await queryRunner.changeColumn(
      'transactions',
      'updated_at',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      }),
    );
    await queryRunner.changeColumn(
      'transactions',
      'completed_at',
      new TableColumn({
        name: 'completed_at',
        type: 'timestamp',
        isNullable: true,
        default: null,
      }),
    );
  }
}
