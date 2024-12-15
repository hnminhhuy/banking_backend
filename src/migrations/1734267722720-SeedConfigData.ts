import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedConfigData1734267722720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO configs (key, value, type)
        VALUES ('INTERNAL_TRANSACTION_FEE', '1100', 'number'),
               ('EXTERNAL_TRANSACTION_FEE', '3300', 'number'),
               ('OPT_TIMEOUT', '1200', 'number');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
