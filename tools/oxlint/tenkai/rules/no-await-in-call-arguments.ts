import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

export const noAwaitInCallArgumentsRule = defineRule({
	meta: {
		type: 'suggestion',
		docs: { description: 'Store awaited results before using them in call or constructor arguments.' },
		messages: { extract: 'Store this awaited result in a variable before passing it to another call.' },
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

					if (parent.type === 'Property' && !parent.computed && parent.value === child) {
						return;
					}

					if (
						(parent.type === 'CallExpression' || parent.type === 'NewExpression') &&
						parent.arguments.some((argument) => argument === child)
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
