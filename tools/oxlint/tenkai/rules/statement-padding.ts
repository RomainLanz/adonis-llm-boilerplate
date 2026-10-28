import { defineRule } from '@oxlint/plugins';
import type { ESTree } from '@oxlint/plugins';

/** Separate control flow from sibling statements, keeping leading comments attached. */
export const statementPaddingRule = defineRule({
	meta: {
		type: 'layout',
		fixable: 'whitespace',
		schema: [],
		messages: {
			missing: 'Add a blank line before control-flow statements and after if statements.',
		},
	},
	createOnce(context) {
		const checkStatements = (statements: ESTree.Statement[]) => {
			for (let index = 1; index < statements.length; index++) {
				const previous = statements[index - 1];
				const next = statements[index];

				if (
					previous.type !== 'IfStatement' &&
					![
						'IfStatement',
						'ReturnStatement',
						'ThrowStatement',
						'SwitchStatement',
						'ForStatement',
						'ForInStatement',
						'ForOfStatement',
					].includes(next.type)
				) {
					continue;
				}

				const comments = context.sourceCode.getCommentsBefore(next);
				const leadingComment = comments.find(
					(comment) => comment.range[0] >= previous.range[1] && comment.loc.start.line > previous.loc.end.line,
				);
				const anchor = leadingComment ?? next;
				const gap = context.sourceCode.text.slice(previous.range[1], anchor.range[0]);

				if (/\r?\n[\t ]*\r?\n/u.test(gap)) {
					continue;
				}

				context.report({
					node: next,
					messageId: 'missing',
					fix(fixer) {
						const newline = context.sourceCode.text.includes('\r\n') ? '\r\n' : '\n';
						return fixer.insertTextBefore(anchor, gap.includes('\n') ? newline : newline.repeat(2));
					},
				});
			}
		};

		return {
			Program: (node) => checkStatements(node.body),
			BlockStatement: (node) => checkStatements(node.body),
			SwitchCase: (node) => checkStatements(node.consequent),
		};
	},
});
