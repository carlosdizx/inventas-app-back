import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seed1721539949647 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('users')
      .values([
        {
          email: 'demo.inventas@yopmail.com',
          password:
            'U2FsdGVkX19muVBpdVxuGWYoSuo013eGnoCR+CAPd6TvD87+5CeRH0XQ2czBjtrWYGzfX8OSGRaTlUTZLuw/tPuIriS0/qdDkojj+dwQqRg=', //87s0VsBJsogV2Eyaxpr2
          status: 2,
          roles: [0],
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('users')
      .where('email = :email', { email: 'demo.inventas@yopmail.com' })
      .execute();
  }
}
