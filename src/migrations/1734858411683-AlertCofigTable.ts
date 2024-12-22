import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AlertConfigTable1734858411683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'configs',
      new TableUnique({
        name: 'UQ_configs_key',
        columnNames: ['key'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint('configs', 'UQ_configs_key');
  }
}
