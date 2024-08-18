import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1723952463983 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user_otps" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "otp" character varying(6) NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        CONSTRAINT "PK_12345abcdef67890" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_67890abcdef12345" UNIQUE ("user_id"),
        CONSTRAINT "FK_abcdef1234567890abcdef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_otps"`);
  }
}
