import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTotalFieldPrecision1755559919550 implements MigrationInterface {
  name = 'FixTotalFieldPrecision1755559919550'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First modify the column to increase precision to handle larger numbers
    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      ALTER COLUMN "total" TYPE numeric(15,2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      ALTER COLUMN "total" TYPE numeric(10,2)
    `);
  }
}
