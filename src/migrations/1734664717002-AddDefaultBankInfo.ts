import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export class AddDefaultBankInfo1734664717002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const bankId = uuidv4();
    await queryRunner.query(
      `
          INSERT INTO banks (id, code, name, short_name, public_key, logo_url, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
          ON CONFLICT (code) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            short_name = EXCLUDED.short_name,
            public_key = EXCLUDED.public_key,
            logo_url = EXCLUDED.logo_url,
            updated_at = NOW()
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
          UPDATE banks
          SET 
            name = $2,
            short_name = $3,
            public_key = $4,
            logo_url = $5,
            updated_at = NOW()
          WHERE code = $1
        `,
      [
        'NHB',
        'National Heritage Bank',
        'NH Bank',
        process.env.JWT_PUBLIC_KEY,
        'https://example.com/logo.png',
      ],
    );
  }
}
