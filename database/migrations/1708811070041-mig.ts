import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1708811070041 implements MigrationInterface {
  name = 'Mig1708811070041';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     CREATE TABLE clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        document_number VARCHAR(255) NOT NULL,
        document_type INTEGER NOT NULL,
        names VARCHAR(255) NOT NULL,
        surnames VARCHAR(255) NOT NULL,
        phone VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL,
        "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
        "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS clients CASCADE;`);
  }
}
