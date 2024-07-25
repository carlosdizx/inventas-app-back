import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExtensionAndSetTimeZone1721865364073
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
      await queryRunner.query(`SET TIME ZONE 'America/Bogota'`);
    } catch (error) {
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`SET TIME ZONE 'UTC'`);
    } catch (error) {
      throw error;
    }
  }
}
