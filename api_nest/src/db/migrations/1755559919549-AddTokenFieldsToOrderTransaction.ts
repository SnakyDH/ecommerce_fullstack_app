import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenFieldsToOrderTransaction1755559919549 implements MigrationInterface {
  name = 'AddTokenFieldsToOrderTransaction1755559919549'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      ADD COLUMN "acceptanceEndUserPolicyToken" character varying
    `);

    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      ADD COLUMN "acceptancePersonalDataAuthorizationToken" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      DROP COLUMN "acceptancePersonalDataAuthorizationToken"
    `);

    await queryRunner.query(`
      ALTER TABLE "order_transactions"
      DROP COLUMN "acceptanceEndUserPolicyToken"
    `);
  }
}
