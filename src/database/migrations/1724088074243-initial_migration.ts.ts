import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration implements MigrationInterface {
  // Development initially using synchronize: true option,
  // But in the future for production use migrations

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
