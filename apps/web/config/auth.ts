import { defineConfig } from '@adonisjs/auth';
import { sessionGuard } from '@adonisjs/auth/session';
import { configProvider } from '@adonisjs/core';
import type { InferAuthenticators, InferAuthEvents, Authenticators } from '@adonisjs/auth/types';

const authConfig = defineConfig({
	/**
	 * Default guard used when no guard is explicitly specified.
	 */
	default: 'web',

	guards: {
		/**
		 * Session-based guard for browser authentication.
		 */
		web: sessionGuard({
			/**
			 * Enable persistent login using remember-me tokens.
			 */
			useRememberMeTokens: false,

			provider: configProvider.create(async (app) => {
				const { makeSessionKyselyUserProvider } = await import('#identity/session_user_provider');
				return makeSessionKyselyUserProvider(app);
			}),
		}),
	},
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
	export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
