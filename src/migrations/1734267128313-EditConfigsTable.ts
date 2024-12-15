import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class EditConfigsTable1734267128313 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'configs',
      'id',
      new TableColumn({
        name: 'id',
        type: 'serial',
        isPrimary: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'configs',
      'id',
      new TableColumn({
        name: 'id',
        type: 'uuid',
        isPrimary: true,
      }),
    );
  }
}
