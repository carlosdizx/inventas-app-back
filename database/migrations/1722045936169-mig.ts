import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1722045936169 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE users_roles_enum ADD VALUE '4';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
