import { defineRule } from '@oxlint/plugins';

export const noTypescriptPrivateRule = defineRule({
	meta: {
		type: 'problem',
		docs: {
			description: 'Require native JavaScript private fields while allowing readonly constructor parameter properties.',
		},
		messages: {
			preferNative: 'Use a native JavaScript #private member instead of the TypeScript private modifier.',
		},
	},
	createOnce(context) {
		const reportPrivateMember = (node: { accessibility?: 'private' | 'protected' | 'public' | null }) => {
			if (node.accessibility === 'private') {
				context.report({ node, messageId: 'preferNative' });
			}
		};

		return {
			MethodDefinition: reportPrivateMember,
			PropertyDefinition: reportPrivateMember,
			TSParameterProperty(node) {
				if (node.accessibility === 'private' && !node.readonly) {
					context.report({ node, messageId: 'preferNative' });
				}
			},
		};
	},
});
