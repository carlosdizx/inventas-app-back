import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1706842256093 implements MigrationInterface {
  name = 'Seed1706842256093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO users (email, password, roles, status)
        VALUES ('admin.inventas@yopmail.com',
                'U2FsdGVkX18odDYxf58NSpkwuRieheon6yN9YUakE0rVseA4FtwWzPLkZxCBJdNXF7BmOZ14GR8UPt4dfwnSgJ32KtfSTl8xV6BziFH0Ivk=',
                '{0}', 2);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email='admin.inventas@yopmail.com';`,
    );
  }
}
