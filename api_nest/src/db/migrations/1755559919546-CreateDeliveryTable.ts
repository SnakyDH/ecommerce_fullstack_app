import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDeliveryTable1755559919546 implements MigrationInterface {
  name = 'CreateDeliveryTable1755559919546'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "deliveries" (
                "id" SERIAL NOT NULL,
                "customer" character varying NOT NULL,
                "customerEmail" character varying NOT NULL,
                "address" text NOT NULL,
                "country" character varying NOT NULL,
                "region" character varying NOT NULL,
                "city" character varying NOT NULL,
                "postalCode" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "fee" numeric(10,2),
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_a7bc79a645c0842e089d8ed6b0f" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "deliveries"
        `);
  }
}
