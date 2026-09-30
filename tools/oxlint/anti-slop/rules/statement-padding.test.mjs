import { RuleTester } from 'eslint';
import plugin from '../index.ts';

const tester = new RuleTester();

tester.run('statement-padding', plugin.rules['statement-padding'], {
	valid: [
		'function run() { return 1; }',
		'function run() { if (ready) { return; } else { throw error; } }',
		'function run() { switch (value) { case 1: return 1; default: throw error; } }',
		'function run() { for (const item of items) { return item; } }',
		'function run() { if (ready) { start(); } }',
		'if (ready) { start(); } else if (waiting) { wait(); } else { stop(); }',
		'prepare();\n\nif (ready) { start(); }\n\nfinish();',
		'if (ready) { start(); }\n\n// Next operation\nfinish();',
		'prepare();\n\n// Guard\nif (ready) { start(); }',
	],
	invalid: [
		...[
			'return 1;',
			'throw error;',
			'switch (value) { case 1: return 1; }',
			'for (;;) { break; }',
			'for (const key in object) { use(key); }',
			'for (const item of items) { use(item); }',
		].map((statement) => ({
			code: `function run() {\nprepare();\n// Control flow\n${statement}\n}`,
			output: `function run() {\nprepare();\n\n// Control flow\n${statement}\n}`,
			errors: [{ messageId: 'missing' }],
		})),
		{
			code: 'prepare();\nif (ready) { start(); }\nfinish();',
			output: 'prepare();\n\nif (ready) { start(); }\n\nfinish();',
			errors: [{ messageId: 'missing' }, { messageId: 'missing' }],
		},
		{
			code: 'function run() {\nprepare();\n// Guard\nif (ready) { start(); }\n}',
			output: 'function run() {\nprepare();\n\n// Guard\nif (ready) { start(); }\n}',
			errors: [{ messageId: 'missing' }],
		},
		{
			code: 'if (ready) { start(); } else if (waiting) { wait(); }\n// Finish\nfinish();',
			output: 'if (ready) { start(); } else if (waiting) { wait(); }\n\n// Finish\nfinish();',
			errors: [{ messageId: 'missing' }],
		},
		{
			code: 'prepare(); // Preparation\nif (ready) { start(); }',
			output: 'prepare(); // Preparation\n\nif (ready) { start(); }',
			errors: [{ messageId: 'missing' }],
		},
		{
			code: 'switch (value) { case 1: prepare();\nif (ready) { start(); }\nbreak; }',
			output: 'switch (value) { case 1: prepare();\n\nif (ready) { start(); }\n\nbreak; }',
			errors: [{ messageId: 'missing' }, { messageId: 'missing' }],
		},
		{
			code: 'if (ready) { start(); }\nif (waiting) { wait(); }',
			output: 'if (ready) { start(); }\n\nif (waiting) { wait(); }',
			errors: [{ messageId: 'missing' }],
		},
		{
			code: 'prepare();\r\nif (ready) { start(); }',
			output: 'prepare();\r\n\r\nif (ready) { start(); }',
			errors: [{ messageId: 'missing' }],
		},
		{
			code: 'prepare(); if (ready) { start(); }',
			output: 'prepare(); \n\nif (ready) { start(); }',
			errors: [{ messageId: 'missing' }],
		},
	],
});
