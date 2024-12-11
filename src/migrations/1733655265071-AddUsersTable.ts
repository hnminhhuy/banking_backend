import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersTable1733655265071 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username varchar(255) UNIQUE,
            verified_email BOOLEAN DEFAULT false,
            student_id varchar(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            additional_email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE users');
  }
}
