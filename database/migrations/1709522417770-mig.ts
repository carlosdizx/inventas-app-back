import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1709522417770 implements MigrationInterface {
  name = 'Mig1709522417770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE table payments
       (
           id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
           total_amount NUMERIC(10, 2),
           client_id UUID CONSTRAINT fk_payments_clients REFERENCES clients ON DELETE CASCADE,
           enterprise_id UUID CONSTRAINT fk_payments_enterprises REFERENCES enterprises,
           "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
           "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
       );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS payments;`);
  }
}
