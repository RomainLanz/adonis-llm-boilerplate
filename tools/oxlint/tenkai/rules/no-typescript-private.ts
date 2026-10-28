import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

export const noTypescriptPrivateRule = defineRule({
	meta: {
		type: 'problem',
		docs: {
			description:
				'Require native JavaScript private members, except constructors and readonly constructor parameter properties.',
		},
		messages: {
			preferNative: 'Use a native JavaScript #private member instead of the TypeScript private modifier.',
		},
	},
	createOnce(context) {
		const reportPrivateMember = (node: ESTree.MethodDefinition | ESTree.PropertyDefinition) => {
			if (node.accessibility === 'private') {
				context.report({ node, messageId: 'preferNative' });
			}
		};

		return {
			MethodDefinition(node) {
				if (node.kind !== 'constructor') {
					reportPrivateMember(node);
				}
			},
			PropertyDefinition: reportPrivateMember,
			TSParameterProperty(node) {
				if (node.accessibility === 'private' && !node.readonly) {
					context.report({ node, messageId: 'preferNative' });
				}
			},
		};
	},
});
