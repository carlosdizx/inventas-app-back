import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1706842256093 implements MigrationInterface {
  name = 'Seed1706842256093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO users (email, password, roles, status)
        VALUES ('admin.inventas@yopmail.com',
                'U2FsdGVkX18odDYxf58NSpkwuRieheon6yN9YUakE0rVseA4FtwWzPLkZxCBJdNXF7BmOZ14GR8UPt4dfwnSgJ32KtfSTl8xV6BziFH0Ivk=',
                '{0}',
                2);
        `);

    await queryRunner.query(`
        INSERT INTO enterprises (name, document_number, document_type, status) 
        VALUES  ('Técnologica del Pacífico', '548.5554.255-1', 2, 2);

        INSERT INTO user_details (first_name, last_name, document_number, document_type, phone, gender, birthdate)
        VALUES ('Ernesto', 'Díaz', '1082749257', 0, '3026508102', true, '1998-01-13');
        `);

    const [enterprise] = await queryRunner.query(`SELECT * FROM enterprises;`);
    const [detail] = await queryRunner.query(`SELECT * FROM user_details;`);

    await queryRunner.query(`
        INSERT INTO users (email, password, status, roles, user_detail_id, enterprise_id) VALUES
            ('ernesto.owner@yopmail.com',
             'U2FsdGVkX18odDYxf58NSpkwuRieheon6yN9YUakE0rVseA4FtwWzPLkZxCBJdNXF7BmOZ14GR8UPt4dfwnSgJ32KtfSTl8xV6BziFH0Ivk=',
             2,
             '{1}',
             '${detail.id}',
             '${enterprise.id}');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM users WHERE email IN ('admin.inventas@yopmail.com','ernesto.owner@yopmail.com');
        DELETE FROM user_details WHERE document_number='1082749257';
        DELETE FROM enterprises WHERE document_number='548.5554.255-1';
      `);
  }
}
