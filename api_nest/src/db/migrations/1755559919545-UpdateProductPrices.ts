import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductPrices1755559919545 implements MigrationInterface {
  name = 'UpdateProductPrices1755559919545'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE "products" 
            SET "price" = "price" * 1000 
            WHERE "price" IS NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE "products" 
            SET "price" = "price" / 1000 
            WHERE "price" IS NOT NULL AND "price" % 1000 = 0
        `);
  }
}
