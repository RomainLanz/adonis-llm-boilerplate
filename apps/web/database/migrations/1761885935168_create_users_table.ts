import { sql, type Kysely } from 'kysely';

export async function up(db: Kysely<unknown>) {
	await db.schema
		.createTable('users')
		.addColumn('id', 'uuid', (column) => column.primaryKey())
		.addColumn('name', 'text')
		.addColumn('email', 'text', (column) => column.notNull())
		.addColumn('password', 'text', (column) => column.notNull())
		.addColumn('created_at', 'timestamptz', (column) => column.notNull().defaultTo(sql`now()`))
		.addColumn('updated_at', 'timestamptz')
		.execute();

	await db.schema
		.createIndex('users_email_unique')
		.unique()
		.on('users')
		.expression(sql`lower(email)`)
		.execute();
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable('users').execute();
}
