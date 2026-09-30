import { eslintCompatPlugin } from '@oxlint/plugins';
import { noTypescriptPrivateRule } from './rules/no_typescript_private.ts';

const projectStylePlugin = eslintCompatPlugin({
	meta: { name: 'project-style' },
	rules: {
		'no-typescript-private': noTypescriptPrivateRule,
	},
});

export default projectStylePlugin;
