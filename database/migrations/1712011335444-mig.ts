import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1712011335444 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plans"
       (
           "id" UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
           "name" CHARACTER VARYING NOT NULL,
           "description" CHARACTER VARYING NOT NULL,
           "max_users" INTEGER  NOT NULL,
           "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
           "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
       )`,
    );

    await queryRunner.query(`ALTER TABLE "enterprises" ADD "planId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "enterprises" ADD CONSTRAINT "FK_enterprises_planId" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "enterprises" DROP CONSTRAINT IF EXISTS "FK_enterprises_planId"`,
    );
    await queryRunner.query(`ALTER TABLE "enterprises" DROP COLUMN "planId"`);
    await queryRunner.query(`DROP TABLE "plans"`);
  }
}
