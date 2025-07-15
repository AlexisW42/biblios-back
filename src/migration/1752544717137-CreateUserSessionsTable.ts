import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserSessionsTable1752544717137 implements MigrationInterface {
    name = 'CreateUserSessionsTable1752544717137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_sessions" (
                "sid" character varying NOT NULL,
                "sess" json NOT NULL,
                "expire" TIMESTAMP(6) NOT NULL,
                CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid")
            )
        `);
        // El índice en 'expire' es para que la limpieza de sesiones expiradas sea rápida.
        await queryRunner.query(`CREATE INDEX "IDX_user_sessions_expire" ON "user_sessions" ("expire")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_sessions"`);
    }

}
