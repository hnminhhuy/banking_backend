import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class BankAddColumnAlgorithm1734855242725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'banks',
      new TableColumn({
        name: 'algorithm',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.query(`UPDATE banks SET algorithm = 'RS256'`);

    await queryRunner.changeColumn(
      'banks',
      'algorithm',
      new TableColumn({
        name: 'algorithm',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('banks', 'algorithm');
  }
}
