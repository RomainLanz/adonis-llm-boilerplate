import { defineConfig } from 'oxlint';

export default defineConfig({
	ignorePatterns: [
		'**/.adonisjs/**',
		'**/build/**',
		'**/tmp/**',
		'**/public/assets/**',
		'**/storybook-static/**',
		'.agent/**',
		'.agents/**',
		'.claude/**',
		'.codex/**',
	],
	plugins: ['typescript', 'react', 'jsx-a11y', 'react-perf'],
	jsPlugins: [{ name: 'project-style', specifier: './tools/oxlint/project-style/index.ts' }],
	settings: {
		react: {
			version: '19.2.8',
		},
	},
	rules: {
		'curly': ['error', 'all'],
		'project-style/blank-line-after-imports': 'error',
		'project-style/blank-line-before-if': 'error',
		'project-style/no-typescript-private': 'error',
		'react/react-in-jsx-scope': 'off',
		'typescript/consistent-type-definitions': ['error', 'interface'],
	},
});
