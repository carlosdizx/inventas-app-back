import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1721544980376 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Básico',
        description:
          'Plan diseñado para empresas que están comenzando, con hasta 3 usuarios.',
        max_users: 3,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Estándar',
        description:
          'Ideal para empresas en crecimiento que requieren hasta 5 usuarios.',
        max_users: 5,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Avanzado',
        description:
          'Perfecto para empresas con necesidades de hasta 10 usuarios.',
        max_users: 10,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Premium',
        description: 'Para empresas que necesitan hasta 15 usuarios.',
        max_users: 15,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Pro',
        description:
          'Plan avanzado para empresas medianas con hasta 30 usuarios.',
        max_users: 30,
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('plans')
      .values({
        name: 'Full',
        description:
          'El mejor plan para empresas medianas o grandes, soportando hasta 50 usuarios.',
        max_users: 50,
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('plans')
      .where('name IN (:...names)', {
        names: ['Básico', 'Estándar', 'Avanzado', 'Premium', 'Pro', 'Full'],
      })
      .execute();
  }
}
