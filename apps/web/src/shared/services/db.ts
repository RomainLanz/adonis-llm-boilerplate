import app from '@adonisjs/core/services/app';
import logger from '@adonisjs/core/services/logger';
import { Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import env from '#start/env';
import type { DB } from '#types/db';

const sql = postgres(env.get('DATABASE_URL').release(), { max: 20 });

export const db = new Kysely<DB>({
	dialect: new PostgresJSDialect({ postgres: sql }),
	log(event) {
		if (app.inProduction || event.level !== 'query') {
			return;
		}
		logger.debug({ duration: event.queryDurationMillis, sql: event.query.sql }, 'database query');
	},
});

app.terminating(() => db.destroy());
