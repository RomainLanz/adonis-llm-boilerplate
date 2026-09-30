import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cases = {
	'statement-padding': {
		valid: ['prepare();\n\n// Guard\nif (ready) { start(); }\n\nfinish();'],
		invalid: ['function run() { prepare(); return 1; }'],
	},
	'no-chained-type-assertions': {
		valid: ['const value = input as string;', 'const value = [1] as const;'],
		invalid: ['const value = (input as unknown) as string;'],
	},
	'no-conditional-empty-object-spread': {
		valid: ['const value = { ...input };'],
		invalid: ['const value = { ...(ready ? { id: 1 } : {}) };'],
	},
	'no-known-value-widening': {
		valid: ['const value = { id: 1 } satisfies { id: number };'],
		invalid: ['const value: unknown = { id: 1 };'],
	},
	'no-module-mocking': {
		valid: ['const vi = { mock() {} }; vi.mock();'],
		invalid: ['import { vi as testing } from "vitest"; testing.mock("dependency");'],
	},
	'no-object-parameters': {
		valid: ['function read(value: { id: string }) {}'],
		invalid: ['type Input = object; function read(value: Input) {}'],
	},
	'no-reflect-apply': {
		valid: ['function run(Reflect: { apply(): void }) { Reflect.apply(); }'],
		invalid: ['Reflect["apply"](run, null, []);'],
	},
	'no-reflect-get': {
		valid: ['function run(Reflect: { get(): void }) { Reflect.get(); }'],
		invalid: ['Reflect["get"](input, "id");'],
	},
	'no-runtime-typeof': {
		valid: ['type Input = typeof input;'],
		invalid: ['const valid = typeof input === "string";'],
	},
	'no-shape-in-symbol-names': {
		valid: ['const deployment = 1;'],
		invalid: ['const deploymentShape = 1;'],
	},
	'no-unknown-parameters': {
		valid: ['function read(cause: unknown) {}'],
		invalid: ['function read(input: unknown) {}'],
	},
	'no-unknown-returns': {
		valid: ['function read(): Promise<string> { return input; }'],
		invalid: ['type Output = unknown; function read(): Promise<Output> { return input; }'],
	},
	'no-unknown-type-aliases': {
		valid: ['type Output = { cause: unknown };'],
		invalid: ['type Output = unknown;'],
	},
	'no-unsafe-dictionary-type': {
		valid: ['type Labels = Record<string, string>;'],
		invalid: ['type Labels = Record<string, unknown>;'],
	},
	'no-widen-then-assert': {
		valid: ['const input = { id: 1 }; const output = input.id;'],
		invalid: ['const input: unknown = { id: 1 }; const output = input as { id: number };'],
	},
	'require-safety-comment-for-type-assertion': {
		valid: [
			'const input = [1] as const;',
			'// SAFETY: the schema validated this value.\nconst input = value as string;',
		],
		invalid: ['const input = value as string;'],
	},
};

for (const [name, fixtures] of Object.entries(cases)) {
	test(name, (context) => {
		const directory = mkdtempSync(join(tmpdir(), 'tenkai-lint-'));
		context.after(() => rmSync(directory, { recursive: true, force: true }));
		const config = join(directory, 'oxlint.json');
		writeFileSync(
			config,
			JSON.stringify({
				jsPlugins: [{ name: 'anti-slop', specifier: fileURLToPath(new URL('../index.ts', import.meta.url)) }],
				rules: { [`anti-slop/${name}`]: 'error' },
			}),
		);

		for (const [category, sources] of Object.entries(fixtures)) {
			for (const source of sources) {
				const filename = join(directory, 'input.ts');
				writeFileSync(filename, source);
				const result = spawnSync(
					process.execPath,
					[
						fileURLToPath(new URL('../../../../node_modules/oxlint/bin/oxlint', import.meta.url)),
						'--config',
						config,
						'--format',
						'json',
						filename,
					],
					{ encoding: 'utf8' },
				);
				assert.equal(result.status, category === 'valid' ? 0 : 1, result.stderr || source);
				const diagnostics = JSON.parse(result.stdout).diagnostics;
				assert.equal(
					diagnostics.filter((diagnostic) => diagnostic.code === `anti-slop(${name})`).length,
					category === 'valid' ? 0 : 1,
					source,
				);
			}
		}
	});
}
