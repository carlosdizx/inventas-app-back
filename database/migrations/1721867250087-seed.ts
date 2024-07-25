import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1721867250087 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .update('users')
      .set({ email: 'superadmin.inventas@yopmail.com' })
      .where('email = :email', { email: 'demo.inventas@yopmail.com' })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .update('users')
      .set({ email: 'demo.inventas@yopmail.com' })
      .where('email = :email', { email: 'superadmin.inventas@yopmail.com' })
      .execute();
  }
}
