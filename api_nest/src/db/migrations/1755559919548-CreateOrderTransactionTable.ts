import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTransactionTable1755559919548 implements MigrationInterface {
  name = 'CreateOrderTransactionTable1755559919548'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "transaction_status_enum" AS ENUM('pending', 'approved', 'rejected')
        `);

    await queryRunner.query(`
            CREATE TABLE "order_transactions" (
                "id" SERIAL NOT NULL,
                "paymentGatewayTransactionId" character varying,
                "quantity" integer NOT NULL,
                "total" numeric(10,2),
                "status" "transaction_status_enum" NOT NULL DEFAULT 'pending',
                "productId" integer NOT NULL,
                "deliveryId" integer,
                "acceptanceEndUserPolicyUrl" character varying,
                "acceptancePersonalDataAuthorizationUrl" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_order_transactions" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            ALTER TABLE "order_transactions" 
            ADD CONSTRAINT "FK_order_transactions_product" 
            FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "order_transactions" 
            ADD CONSTRAINT "FK_order_transactions_delivery" 
            FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_order_transactions_delivery"
        `);

    await queryRunner.query(`
            ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_order_transactions_product"
        `);

    await queryRunner.query(`
            DROP TABLE "order_transactions"
        `);

    await queryRunner.query(`
            DROP TYPE "transaction_status_enum"
        `);
  }
}
