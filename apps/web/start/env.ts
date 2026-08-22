/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env';

const env = await Env.create(new URL('../', import.meta.url), {
	// Node
	NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
	PORT: Env.schema.number(),
	HOST: Env.schema.string({ format: 'host' }),
	LOG_LEVEL: Env.schema.string(),

	// App
	APP_KEY: Env.schema.secret(),
	APP_URL: Env.schema.string({ format: 'url', tld: false }),

	// Database
	DATABASE_URL: Env.schema.secret(),

	// Session
	SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),
});

try {
	const databaseUrl = new URL(env.get('DATABASE_URL').release());

	if (
		!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) ||
		!databaseUrl.hostname ||
		!databaseUrl.pathname ||
		databaseUrl.pathname === '/'
	) {
		throw new Error();
	}
} catch {
	throw new Error('Invalid environment variable "DATABASE_URL": expected a PostgreSQL connection URL');
}

export default env;
