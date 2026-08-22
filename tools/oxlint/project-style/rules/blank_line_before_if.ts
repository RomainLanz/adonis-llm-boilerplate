import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

function hasBlankLineBetween(sourceText: string, previous: ESTree.Node, next: ESTree.Node) {
	const linesBetween = sourceText.slice(previous.end, next.start).split(/\r?\n/u).slice(1, -1);
	return linesBetween.some((line) => line.trim() === '');
}

function isFunctionBody(block: ESTree.BlockStatement) {
	return (
		block.parent.type === 'ArrowFunctionExpression' ||
		block.parent.type === 'FunctionDeclaration' ||
		block.parent.type === 'FunctionExpression'
	);
}

export const blankLineBeforeIfRule = defineRule({
	meta: {
		type: 'layout',
		fixable: 'whitespace',
		docs: {
			description: 'Require a blank line before if statements except at the start of a function.',
		},
		messages: {
			missing: 'Add a blank line before this if statement.',
		},
	},
	createOnce(context) {
		return {
			IfStatement(node) {
				if (node.parent.type === 'IfStatement' && node.parent.alternate === node) {
					return;
				}

				if (node.parent.type !== 'BlockStatement') {
					return;
				}

				const statementIndex = node.parent.body.indexOf(node);

				if (statementIndex === 0 && isFunctionBody(node.parent)) {
					return;
				}

				if (statementIndex === 0) {
					return;
				}

				const previousStatement = node.parent.body[statementIndex - 1];

				if (hasBlankLineBetween(context.sourceCode.text, previousStatement, node)) {
					return;
				}

				context.report({
					node,
					messageId: 'missing',
					fix(fixer) {
						return fixer.insertTextBefore(node, '\n');
					},
				});
			},
		};
	},
});
