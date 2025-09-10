import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1757539413215 implements MigrationInterface {
    name = 'Migrations1757539413215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_order_transactions_product"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_order_transactions_delivery"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD "vat" numeric(15,2)`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_transactions_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" TYPE "public"."order_transactions_status_enum" USING "status"::"text"::"public"."order_transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_transactions_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" TYPE "public"."order_transactions_status_enum" USING "status"::"text"::"public"."order_transactions_status_enum"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_d594d48454c3f2c85e2e1040a52" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_81ba699e6c9b8dc7ba0e931a5c9" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_81ba699e6c9b8dc7ba0e931a5c9"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP CONSTRAINT "FK_d594d48454c3f2c85e2e1040a52"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum_old" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_transactions_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum_old" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."order_transactions_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"`);
        
        await queryRunner.query(`ALTER TABLE "order_transactions" DROP COLUMN "vat"`);



        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_order_transactions_delivery" FOREIGN KEY ("deliveryId") REFERENCES "deliveries"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_transactions" ADD CONSTRAINT "FK_order_transactions_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

}
