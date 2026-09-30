import { eslintCompatPlugin } from '@oxlint/plugins';
import { blankLineAfterImportsRule } from './rules/blank_line_after_imports.ts';
import { noTypescriptPrivateRule } from './rules/no_typescript_private.ts';

const projectStylePlugin = eslintCompatPlugin({
	meta: { name: 'project-style' },
	rules: {
		'blank-line-after-imports': blankLineAfterImportsRule,
		'no-typescript-private': noTypescriptPrivateRule,
	},
});

export default projectStylePlugin;
