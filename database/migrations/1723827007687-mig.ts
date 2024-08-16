import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1723827007687 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventories
      RENAME COLUMN location TO name;
    `);

    await queryRunner.query(`
      ALTER TABLE inventories
      ADD COLUMN city VARCHAR(255),
      ADD COLUMN state VARCHAR(255),
      ADD COLUMN zipCode VARCHAR(20),
      ADD COLUMN country VARCHAR(255),
      ADD COLUMN address VARCHAR(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE inventories
      DROP COLUMN city,
      DROP COLUMN state,
      DROP COLUMN zipCode,
      DROP COLUMN country,
      DROP COLUMN address;
    `);

    await queryRunner.query(`
      ALTER TABLE inventories
      RENAME COLUMN name TO location;
    `);
  }
}
