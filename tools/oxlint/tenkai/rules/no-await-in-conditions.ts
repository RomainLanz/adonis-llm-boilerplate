import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

export const noAwaitInConditionsRule = defineRule({
	meta: {
		type: 'suggestion',
		docs: { description: 'Store awaited results before testing them in control-flow conditions.' },
		messages: { extract: 'Store this awaited result in a variable before using it in a condition.' },
	},
	createOnce(context) {
		return {
			AwaitExpression(node) {
				let child: ESTree.Node = node;
				let parent = child.parent;

				while (parent) {
					if (
						parent.type === 'ArrowFunctionExpression' ||
						parent.type === 'FunctionExpression' ||
						parent.type === 'FunctionDeclaration'
					) {
						return;
					}

					if (
						(parent.type === 'IfStatement' ||
							parent.type === 'WhileStatement' ||
							parent.type === 'DoWhileStatement' ||
							parent.type === 'ForStatement' ||
							parent.type === 'ConditionalExpression') &&
						parent.test === child
					) {
						context.report({ node, messageId: 'extract' });

						return;
					}

					child = parent;
					parent = child.parent;
				}
			},
		};
	},
});
