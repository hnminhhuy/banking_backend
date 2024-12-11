import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddRefreshTokensTable1733900977727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'refresh_token', type: 'varchar' },
          { name: 'user_id', type: 'uuid', isNullable: true },
          { name: 'bank_id', type: 'uuid', isNullable: true },
          { name: 'provider', type: 'varchar' },
          { name: 'issued_at', type: 'timestamp', default: 'NOW()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_tokens');
  }
}
