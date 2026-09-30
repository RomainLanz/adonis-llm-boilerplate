import { defineRule, eslintCompatPlugin } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

const MAX_PARAMETERS = 4;

type ParameterizedNode = ESTree.Node & { params: Array<{ type: string; name?: string }> };

function parameterCount(node: ParameterizedNode) {
	return node.params.filter((parameter) => parameter.type !== 'TSThisParameter' && parameter.name !== 'this').length;
}

function isInjectDecorator(decorator: ESTree.Decorator) {
	const expression = decorator.expression;

	return (
		expression.type === 'CallExpression' &&
		expression.callee.type === 'Identifier' &&
		expression.callee.name === 'inject'
	);
}

const maxParams = defineRule({
	meta: {
		type: 'suggestion',
		docs: { description: 'Limit functions and methods to four parameters.' },
		messages: {
			tooMany: 'Use a named argument object instead of {{count}} parameters. The maximum is 4.',
		},
	},
	createOnce(context) {
		function check(node: ParameterizedNode) {
			const count = parameterCount(node);

			if (count > MAX_PARAMETERS) {
				context.report({ node, messageId: 'tooMany', data: { count } });
			}
		}

		function checkFunction(node: ParameterizedNode) {
			if (node.parent.type !== 'MethodDefinition' && node.parent.type !== 'TSAbstractMethodDefinition') {
				check(node);
			}
		}

		function checkMethod(node: ESTree.MethodDefinition) {
			if (node.kind === 'constructor') {
				const classNode = node.parent.parent;

				if (
					(classNode.type === 'ClassDeclaration' || classNode.type === 'ClassExpression') &&
					classNode.decorators?.some(isInjectDecorator)
				) {
					return;
				}
			}

			check(node.value);
		}

		return {
			FunctionDeclaration: checkFunction,
			FunctionExpression: checkFunction,
			ArrowFunctionExpression: check,
			TSDeclareFunction: checkFunction,
			TSEmptyBodyFunctionExpression: checkFunction,
			MethodDefinition: checkMethod,
			TSAbstractMethodDefinition: checkMethod,
			TSMethodSignature: check,
			TSCallSignatureDeclaration: check,
			TSConstructSignatureDeclaration: check,
			TSFunctionType: check,
			TSConstructorType: check,
		};
	},
});

const noAwaitInCallArguments = defineRule({
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

const noAwaitInConditions = defineRule({
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

export default eslintCompatPlugin({
	meta: { name: 'tenkai' },
	rules: {
		'max-params': maxParams,
		'no-await-in-call-arguments': noAwaitInCallArguments,
		'no-await-in-conditions': noAwaitInConditions,
	},
});
