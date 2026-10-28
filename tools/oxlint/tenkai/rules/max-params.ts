import { defineRule } from '@oxlint/plugins';
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

export const maxParamsRule = defineRule({
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
