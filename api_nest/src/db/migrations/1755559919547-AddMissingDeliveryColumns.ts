import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingDeliveryColumns1755559919547 implements MigrationInterface {
  name = 'AddMissingDeliveryColumns1755559919547'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if columns exist before adding them
    const countryExists = await queryRunner.hasColumn("deliveries", "country");
    const regionExists = await queryRunner.hasColumn("deliveries", "region");

    if (!countryExists) {
      await queryRunner.query(`
                ALTER TABLE "deliveries" 
                ADD COLUMN "country" character varying NOT NULL DEFAULT ''
            `);
    }

    if (!regionExists) {
      await queryRunner.query(`
                ALTER TABLE "deliveries" 
                ADD COLUMN "region" character varying NOT NULL DEFAULT ''
            `);
    }

    // Remove default values after adding columns
    if (!countryExists) {
      await queryRunner.query(`
                ALTER TABLE "deliveries" 
                ALTER COLUMN "country" DROP DEFAULT
            `);
    }

    if (!regionExists) {
      await queryRunner.query(`
                ALTER TABLE "deliveries" 
                ALTER COLUMN "region" DROP DEFAULT
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "deliveries" DROP COLUMN IF EXISTS "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "deliveries" DROP COLUMN IF EXISTS "region"
        `);
  }
}
