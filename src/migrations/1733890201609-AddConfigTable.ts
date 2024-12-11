import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddConfigTable1733890201609 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createTable(
      new Table({
        name: 'configs',
        columns: [
          { name: 'id', type: 'bigint', isPrimary: true },
          { name: 'key', type: 'varchar', isNullable: false },
          { name: 'value', type: 'varchar', isNullable: false },
          { name: 'type', type: 'varchar', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: false,
            default: 'NOW()',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('configs');
  }
}
