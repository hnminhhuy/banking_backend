import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMetadataBankTable1735709934485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'banks',
      new TableColumn({
        name: 'metadata',
        type: 'jsonb',
        isNullable: true,
      }),
    );

    if (
      process.env.EXTERNAL_BANK_CLIENT_SECRET &&
      process.env.EXTERNAL_BANK_API_URL &&
      process.env.EXTERNAL_BANK_REFRESH_URL &&
      process.env.BANK_DEFAULT_CODE &&
      process.env.EXTERNAL_BANK_CLIENT_ID &&
      process.env.EXTERNAL_BANK_AUTH_URL
    ) {
      await queryRunner.query(
        `
                UPDATE banks
                SET metadata = '{
                        "clientId" : "${process.env.EXTERNAL_BANK_CLIENT_ID}",
                        "clientSecret" : "${process.env.EXTERNAL_BANK_CLIENT_SECRET}",
                        "apiUrl" : "${process.env.EXTERNAL_BANK_API_URL}",
                        "authUrl" : "${process.env.EXTERNAL_BANK_AUTH_URL}",
                        "refreshUrl" : "${process.env.EXTERNAL_BANK_REFRESH_URL}"
                }'
                WHERE code <> '${process.env.BANK_DEFAULT_CODE}'
            `,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('banks', 'metadata');
  }
}
