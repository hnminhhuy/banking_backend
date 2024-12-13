import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddBanksTable1733900205526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'code',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'short_name',
            type: 'varchar',
          },
          {
            name: 'public_key',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'logo_url',
            type: 'varchar',
            isNullable: true,
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

    const bankId = uuidv4();
    await queryRunner.query(
      `
          INSERT INTO banks (id, code, name, short_name, public_key, logo_url, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
      [
        bankId,
        'NHB',
        'National Heritage Bank',
        'NH Bank',
        process.env.JWT_PUBLIC_KEY,
        'https://example.com/logo.png',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('banks');
  }
}
