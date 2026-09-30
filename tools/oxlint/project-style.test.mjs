import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cases = {
	'no-typescript-private': {
		valid: [
			'class Service { private constructor(private readonly dependency: string) {} }',
			'class Service { protected constructor() {} protected run() {} public value = 1; }',
			'class Service { readonly #value = 1; #run() { return this.#value; } }',
		],
		invalid: [
			'class Service { private value = 1; }',
			'class Service { private readonly value = 1; }',
			'class Service { private run() {} }',
			'class Service { private get value() { return 1; } }',
			'class Service { private static run() {} }',
			'class Service { private constructor(private dependency: string) {} }',
		],
	},
};

for (const [name, fixtures] of Object.entries(cases)) {
	test(name, (context) => {
		const directory = mkdtempSync(join(tmpdir(), 'project-style-lint-'));
		context.after(() => rmSync(directory, { recursive: true, force: true }));
		const config = join(directory, 'oxlint.json');
		const filename = join(directory, 'input.ts');
		writeFileSync(
			config,
			JSON.stringify({
				jsPlugins: [
					{ name: 'project-style', specifier: fileURLToPath(new URL('./project-style/index.ts', import.meta.url)) },
				],
				rules: { [`project-style/${name}`]: 'error' },
			}),
		);

		for (const [category, sources] of Object.entries(fixtures)) {
			for (const source of sources) {
				writeFileSync(filename, source);
				const arguments_ = [
					fileURLToPath(new URL('../../node_modules/oxlint/bin/oxlint', import.meta.url)),
					'--config',
					config,
					'--format',
					'json',
					filename,
				];
				const result = spawnSync(process.execPath, arguments_, { encoding: 'utf8' });
				const diagnostics = JSON.parse(result.stdout).diagnostics.filter(
					(diagnostic) => diagnostic.code === `project-style(${name})`,
				);
				assert.equal(result.stderr, '');
				assert.equal(result.status, category === 'valid' ? 0 : 1, source);
				assert.equal(diagnostics.length, category === 'valid' ? 0 : 1, source);
			}
		}
	});
}
