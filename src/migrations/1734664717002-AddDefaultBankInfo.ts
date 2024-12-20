import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddDefaultBankInfo1734664717002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const bankId = uuidv4();
    await queryRunner.query(
      `
          INSERT INTO banks (id, code, name, short_name, public_key, logo_url, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `,
      [
        bankId,
        process.env.BANK_DEFAULT_CODE,
        process.env.BANK_DEFAULT_NAME,
        process.env.BANK_DEFAULT_SHORT_NAME,
        process.env.JWT_PUBLIC_KEY,
        process.env.BANK_DEFAULT_LOGO_URL,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
          DELETE FROM banks
          WHERE code = $1
        `,
      [process.env.BANK_DEFAULT_CODE],
    );
  }
}
