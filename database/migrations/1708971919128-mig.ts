import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1708971919128 implements MigrationInterface {
  name = 'Mig1708971919128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE sales DROP COLUMN IF EXISTS document_client`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE sales ADD COLUMN document_client VARCHAR`,
    );
  }
}
