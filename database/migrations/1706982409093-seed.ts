import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1706982409093 implements MigrationInterface {
  name = 'Seed1706982409093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Un video ma mi gente');
    console.log('Empezemos');
    await queryRunner.query(`
      INSERT INTO user_details (first_name, last_name, document_number, document_type, phone, gender, birthdate)
      VALUES ('Laura', 'Pérez', '1029384756', 0, '3104567890', false, '1990-05-22'),
             ('Carlos', 'Martínez', '847560293', 0, '3201234567', true, '1985-08-15'),
             ('Ana', 'Gómez', '1234567890', 0, '3009876543', false, '1992-11-30');
  `);

    const [enterprise] = await queryRunner.query(
      `SELECT id FROM enterprises WHERE name = 'Técnologica del Pacífico';`,
    );

    const userDetails = await queryRunner.query(`
      SELECT id FROM user_details 
      WHERE document_number IN ('1029384756', '847560293', '1234567890');
  `);

    if (userDetails.length === 3) {
      await queryRunner.query(`
        INSERT INTO users (email, password, status, roles, user_detail_id, enterprise_id) VALUES
            ('laura.perez@yopmail.com',
             'U2FsdGVkX1+8jYd1N72eS1vXnZz0D1q2eXpT3LQ9k4s=',
             2,
             '{1}',
             '${userDetails[0].id}',
             '${enterprise.id}'),
            ('carlos.martinez@yopmail.com',
             'U2FsdGVkX19Rb1xG7E9nA2M4HJk6PwQ3FpL4T5p6u7m=',
             2,
             '{1}',
             '${userDetails[1].id}',
             '${enterprise.id}'),
            ('ana.gomez@yopmail.com',
             'U2FsdGVkX1+5F4I7P5T8D3N4F5G7H8I9J0K1L2M3N4O5=',
             2,
             '{1}',
             '${userDetails[2].id}',
             '${enterprise.id}');
    `);
    } else {
      await this.down(queryRunner);
      console.error(
        'Error: No se encontraron los detalles de usuario esperados.',
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM users WHERE email IN ('laura.perez@yopmail.com','carlos.martinez@yopmail.com','ana.gomez@yopmail.com');
        DELETE FROM user_details WHERE document_number IN('1029384756', '847560293', '1234567890');
      `);
  }
}
