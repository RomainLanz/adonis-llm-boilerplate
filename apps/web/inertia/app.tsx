import './css/app.css';
import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { TuyauProvider } from '@adonisjs/inertia/react';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { type ReactElement } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from '~/layouts/default';
import { client } from './client';

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS';

createInertiaApp({
	title: (title) => (title ? `${title} - ${appName}` : appName),
	resolve: (name) => {
		return resolvePageComponent<ResolvedComponent>(
			`./pages/${name}.tsx`,
			import.meta.glob<ResolvedComponent>('./pages/**/*.tsx'),
			(page: ReactElement) => <Layout>{page}</Layout>,
		);
	},
	setup({ el, App, props }) {
		createRoot(el).render(
			<TuyauProvider client={client}>
				<App {...props} />
			</TuyauProvider>,
		);
	},
	progress: {
		color: '#4B5563',
	},
});
