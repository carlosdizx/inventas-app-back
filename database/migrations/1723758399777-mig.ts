import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1723758399777 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE products
            DROP CONSTRAINT "FK_c9de3a8edea9269ca774c919b9a";
        `);

    await queryRunner.query(`
            ALTER TABLE products
            DROP COLUMN subcategory_id;
        `);

    await queryRunner.query(`
            DROP TABLE subcategories;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE subcategories
            (
                id           uuid default uuid_generate_v4() not null
                    constraint "PK_793ef34ad0a3f86f09d4837007c"
                        primary key,
                name         varchar                         not null,
                "categoryId" uuid
                    constraint "FK_d1fe096726c3c5b8a500950e448"
                        references categories,
                constraint "UQ_45aa12007713728e241d091775d"
                    unique (name, "categoryId")
            );
        `);

    await queryRunner.query(`
            ALTER TABLE products
            ADD COLUMN subcategory_id uuid;
        `);

    await queryRunner.query(`
            ALTER TABLE products
            ADD CONSTRAINT "FK_c9de3a8edea9269ca774c919b9a"
            FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);
        `);
  }
}
