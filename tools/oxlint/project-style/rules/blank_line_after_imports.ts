import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

function hasBlankLineBetween(sourceText: string, previous: ESTree.Node, next: ESTree.Node) {
	const linesBetween = sourceText.slice(previous.end, next.start).split(/\r?\n/u).slice(1, -1);
	return linesBetween.some((line) => line.trim() === '');
}

export const blankLineAfterImportsRule = defineRule({
	meta: {
		type: 'layout',
		fixable: 'whitespace',
		docs: {
			description: 'Require a blank line between the import block and the module body.',
		},
		messages: {
			missing: 'Add a blank line after the import block.',
		},
	},
	createOnce(context) {
		return {
			Program(node) {
				const lastImportIndex = node.body.findLastIndex((statement) => statement.type === 'ImportDeclaration');

				if (lastImportIndex === -1 || lastImportIndex === node.body.length - 1) {
					return;
				}

				const lastImport = node.body[lastImportIndex];
				const nextStatement = node.body[lastImportIndex + 1];

				if (hasBlankLineBetween(context.sourceCode.text, lastImport, nextStatement)) {
					return;
				}

				context.report({
					node: nextStatement,
					messageId: 'missing',
					fix(fixer) {
						return fixer.insertTextBefore(nextStatement, '\n');
					},
				});
			},
		};
	},
});
