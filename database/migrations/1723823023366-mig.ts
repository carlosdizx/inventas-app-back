import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1723823023366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payments
      ADD COLUMN inventory_id uuid;
    `);

    await queryRunner.query(`
      ALTER TABLE payments
      ADD CONSTRAINT FK_payments_inventory
      FOREIGN KEY (inventory_id) REFERENCES inventories(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE payments
      DROP CONSTRAINT FK_payments_inventory;
    `);

    await queryRunner.query(`
      ALTER TABLE payments
      DROP COLUMN inventory_id;
    `);
  }
}
