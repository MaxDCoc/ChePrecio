import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1782255749079 implements MigrationInterface {
  name = ' $npmConfigName1782255749079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "display_name" character varying NOT NULL, "password_hash" character varying NOT NULL, "scan_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "barcode" character varying, "name" character varying NOT NULL, "brand" character varying, "category" character varying, "unit" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_adfc522baf9d9b19cd7d9461b7e" UNIQUE ("barcode"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."scans_verdict_enum" AS ENUM('cheap', 'normal', 'expensive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "scans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "product_id" uuid, "price_cents" integer NOT NULL, "image_url" character varying, "ai_reading" jsonb, "verdict" "public"."scans_verdict_enum", "percentage_diff" numeric(5,2), "lat" numeric(10,7), "lng" numeric(10,7), "scanned_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_41156c08314b9e541c1cb18c588" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sepa_prices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "barcode" character varying, "name" character varying NOT NULL, "brand" character varying, "store_chain" character varying NOT NULL, "province" character varying NOT NULL, "price_cents" integer NOT NULL, "price_date" date NOT NULL, CONSTRAINT "PK_d6f7333fbacd011e5333b0b9f58" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ed2e0496cd96bedff7c464d07" ON "sepa_prices"  ("barcode", "province") `,
    );
    await queryRunner.query(
      `ALTER TABLE "scans" ADD CONSTRAINT "FK_b1d041293c86a1bfbd15c559385" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scans" ADD CONSTRAINT "FK_69640b09dc5ad9d57d3e3617086" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scans" DROP CONSTRAINT "FK_69640b09dc5ad9d57d3e3617086"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scans" DROP CONSTRAINT "FK_b1d041293c86a1bfbd15c559385"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ed2e0496cd96bedff7c464d07"`,
    );
    await queryRunner.query(`DROP TABLE "sepa_prices"`);
    await queryRunner.query(`DROP TABLE "scans"`);
    await queryRunner.query(`DROP TYPE "public"."scans_verdict_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
