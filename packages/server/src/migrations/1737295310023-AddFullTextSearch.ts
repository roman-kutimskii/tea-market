import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullTextSearch1737295310023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE INDEX items_search_vector_idx ON items USING GIN (search_vector);
        CREATE TRIGGER items_search_vector_update BEFORE INSERT OR UPDATE
        ON items FOR EACH ROW EXECUTE FUNCTION
        tsvector_update_trigger(search_vector, 'pg_catalog.english', name);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS items_search_vector_update ON items;
        DROP INDEX IF EXISTS items_search_vector_idx;
      `);
  }
}
