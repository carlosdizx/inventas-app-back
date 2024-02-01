import { MigrationInterface, QueryRunner } from 'typeorm';

export class Mig1706757828513 implements MigrationInterface {
  name = 'Mig1706757828513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `create type users_roles_enum as enum ('0', '1', '2', '3');`,
    );

    await queryRunner.query(`
        CREATE TABLE enterprises
        (
            id UUID    DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
            name            VARCHAR                            NOT NULL,
            document_number VARCHAR                            NOT NULL,
            document_type   INTEGER                            NOT NULL,
            status          INTEGER DEFAULT 0                  NOT NULL,
            CONSTRAINT "UQ_f57b6fa4dbf30401e86bc98abce" UNIQUE (document_number, document_type)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE user_details
        (
            id              UUID DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51"
                    PRIMARY KEY,
            first_name      VARCHAR                         NOT NULL,
            last_name       VARCHAR                         NOT NULL,
            document_number VARCHAR                         NOT NULL,
            document_type   INTEGER                         NOT NULL,
            phone           VARCHAR                         NOT NULL,
            gender          BOOLEAN                         NOT NULL,
            birthdate       DATE                            NOT NULL,
            CONSTRAINT "UQ_4c273f0161a72587516fd21a517"
                UNIQUE (document_number, document_type)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE users
        (
            id             UUID    DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
                    PRIMARY KEY,
            email          VARCHAR                            NOT NULL
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"
                    UNIQUE,
            password       VARCHAR                            NOT NULL,
            status         INTEGER DEFAULT 1                  NOT NULL,
            roles          users_roles_enum[]                 NOT NULL,
            user_detail_id UUID
                CONSTRAINT "REL_7fbd789ba2d9f9643ff3be7e7b"
                    UNIQUE
                CONSTRAINT "FK_7fbd789ba2d9f9643ff3be7e7b0"
                    REFERENCES user_details,
            enterprise_id  UUID
                CONSTRAINT "FK_fbe644d8ff0b13dae28f312b987"
                    REFERENCES enterprises
        );
    `);

    await queryRunner.query(`
        CREATE TABLE categories
        (
            id            UUID    DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"
                    PRIMARY KEY,
            name          VARCHAR                            NOT NULL,
            description   TEXT                               NOT NULL,
            status        INTEGER DEFAULT 2                  NOT NULL,
            enterprise_id UUID
                CONSTRAINT "FK_9c11e0bb5d9b03b64c9c114cb85"
                    REFERENCES enterprises,
            CONSTRAINT "UQ_18b87f694187986b0fb7429fcb6"
                UNIQUE (name, enterprise_id)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE subcategories
        (
            id           UUID DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_793ef34ad0a3f86f09d4837007c"
                    PRIMARY KEY,
            name         VARCHAR                         NOT NULL,
            "categoryId" UUID
                CONSTRAINT "FK_d1fe096726c3c5b8a500950e448"
                    REFERENCES categories,
            CONSTRAINT "UQ_45aa12007713728e241d091775d"
                UNIQUE (name, "categoryId")
        );
    `);

    await queryRunner.query(`
        CREATE TABLE products
        (
            id                  UUID      DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d"
                    PRIMARY KEY,
            name                VARCHAR                              NOT NULL
                CONSTRAINT "UQ_4c9fb58de893725258746385e16"
                    UNIQUE,
            barcode             VARCHAR                              NOT NULL
                CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e"
                    UNIQUE,
            sale_price          NUMERIC                              NOT NULL,
            cost_price          NUMERIC                              NOT NULL,
            discount_percentage INTEGER                              NOT NULL,
            status              INTEGER   DEFAULT 2                  NOT NULL,
            "createdAt"         TIMESTAMP DEFAULT NOW()              NOT NULL,
            "updatedAt"         TIMESTAMP DEFAULT NOW()              NOT NULL,
            enterprise_id       UUID
                CONSTRAINT "FK_1b2bfc1c37bceb3088b2fae04cc"
                    REFERENCES enterprises,
            category_id         UUID
                CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"
                    REFERENCES categories,
            subcategory_id      UUID
                CONSTRAINT "FK_c9de3a8edea9269ca774c919b9a"
                    REFERENCES subcategories,
            CONSTRAINT "UQ_bbdad5523aa4b40269602959fdc"
                UNIQUE (name, enterprise_id)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE inventories
        (
            id            UUID      DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_7b1946392ffdcb50cfc6ac78c0e"
                    PRIMARY KEY,
            location      VARCHAR                              NOT NULL
                CONSTRAINT "UQ_ca4c6c3abea84f4ea813467cc7f"
                    UNIQUE,
            "createdAt"   TIMESTAMP DEFAULT NOW()              NOT NULL,
            "updatedAt"   TIMESTAMP DEFAULT NOW()              NOT NULL,
            enterprise_id UUID
                CONSTRAINT "FK_8d06f7ce99fd8e3fe38ed0e97fd"
                    REFERENCES enterprises
        );
    `);

    await queryRunner.query(`
        CREATE TABLE product_inventories
        (
            id           UUID DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_7ff88ac3f0221978eea3f9f999a"
                    PRIMARY KEY,
            quantity     INTEGER                         NOT NULL,
            product_id   UUID
                CONSTRAINT "FK_e934d1044fc107e226491eee0b6"
                    REFERENCES products,
            inventory_id UUID
                CONSTRAINT "FK_d340c0166d9bfb981aa0a94c413"
                    REFERENCES inventories
        );
    `);

    await queryRunner.query(`
        CREATE TABLE sales
        (
            id              UUID      DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_4f0bc990ae81dba46da680895ea"
                    PRIMARY KEY,
            document_client VARCHAR                              NOT NULL,
            total_amount    NUMERIC(10, 2)                       NOT NULL,
            status          INTEGER   DEFAULT 2                  NOT NULL,
            "createdAt"     TIMESTAMP DEFAULT NOW()              NOT NULL,
            "updatedAt"     TIMESTAMP DEFAULT NOW()              NOT NULL,
            enterprise_id   UUID
                CONSTRAINT "FK_e309f2dc7c1b99278606b13f35e"
                    REFERENCES enterprises,
            inventory_id    UUID                                 NOT NULL
                CONSTRAINT "FK_914d05e8cb36114a16035605c7b"
                    REFERENCES inventories
        );
    `);

    await queryRunner.query(`
        CREATE TABLE sales_details
        (
            id         UUID DEFAULT uuid_generate_v4() NOT NULL
                CONSTRAINT "PK_347905aa7874a8beb27680a8709"
                    PRIMARY KEY,
            quantity   INTEGER                         NOT NULL,
            unit_price NUMERIC(10, 2)                  NOT NULL,
            subtotal   NUMERIC(10, 2)                  NOT NULL,
            product_id UUID
                CONSTRAINT "FK_3b8a57faaababc72063ac2ef82b"
                    REFERENCES products,
            sale_id    UUID
                CONSTRAINT "FK_5846c41781c1b40ee061430f6c6"
                    REFERENCES sales
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS sales_details;
        DROP TABLE IF EXISTS sales;
        DROP TABLE IF EXISTS product_inventories;
        DROP TABLE IF EXISTS inventories;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS subcategories;
        DROP TABLE IF EXISTS categories;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS user_details;
        DROP TABLE IF EXISTS enterprises;
        drop type users_roles_enum;
    `);
  }
}
