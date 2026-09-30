import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';
import { RuleTester } from 'eslint';
import plugin from './tenkai.ts';

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } });

tester.run('max-params', plugin.rules['max-params'], {
	valid: [
		'function boundary(a, b, c, d) {}',
		'const dto = ({ serverId, digest, reason, at, removed }) => removed;',
		'const rest = (first, ...remaining) => remaining;',
		'class Service { constructor(a, b, c, d) {} method(a, b, c, d) {} #private(a, b, c, d) {} }',
		'const service = { method(a, b, c, d) {} };',
	],
	invalid: [
		'function tooMany(a, b, c, d, e) {}',
		'const tooMany = (a, b, c, d, e) => e;',
		'function defaults(a, b, c, d = 1, e = 2) {}',
		'function rest(a, b, c, d, ...remaining) {}',
		'class Service { constructor(a, b, c, d, e) {} }',
		'class Service { method(a, b, c, d, e) {} }',
		'class Service { #private(a, b, c, d, e) {} }',
		'const service = { method(a, b, c, d, e) {} };',
	].map((code) => ({ code, output: null, errors: [{ messageId: 'tooMany' }] })),
});

test('TypeScript signatures and injected constructors are checked by OXLint', () => {
	const directory = mkdtempSync(join(tmpdir(), 'tenkai-max-params-'));
	const pluginPath = resolve('tools/oxlint/tenkai.ts');
	const configPath = join(directory, 'oxlint.config.ts');
	const fixturePath = join(directory, 'fixture.ts');

	try {
		writeFileSync(
			configPath,
			`export default { jsPlugins: [{ name: 'tenkai', specifier: ${JSON.stringify(pluginPath)} }], rules: { 'tenkai/max-params': 'error' } };\n`,
		);
		writeFileSync(
			fixturePath,
			`declare function declared(this: void, a: string, b: string, c: string, d: string): void;
declare function tooMany(this: void, a: string, b: string, c: string, d: string, e: string): void;
interface Contract {
	boundary(this: Contract, a: string, b: string, c: string, d: string): void;
	tooMany(this: Contract, a: string, b: string, c: string, d: string, e: string): void;
}
abstract class Base { abstract run(a: string, b: string, c: string, d: string, e: string): void; }
class Plain { constructor(a: string, b: string, c: string, d: string, e: string) {} }
@inject()
class Injected {
	constructor(a: string, b: string, c: string, d: string, e: string) {}
	run(a: string, b: string, c: string, d: string, e: string) {}
}
type FunctionContract = (a: string, b: string, c: string, d: string, e: string) => void;
type ConstructorContract = new (a: string, b: string, c: string, d: string, e: string) => object;
`,
		);

		const oxlint = execFileSync('yarn', ['bin', 'oxlint'], { encoding: 'utf8' }).trim();
		const result = spawnSync(process.execPath, [oxlint, '-c', configPath, '-f', 'json', fixturePath], {
			encoding: 'utf8',
		});
		const diagnostics = JSON.parse(result.stdout).diagnostics.filter(
			(diagnostic) => diagnostic.code === 'tenkai(max-params)',
		);

		assert.equal(result.stderr, '');
		assert.equal(result.status, 1);
		assert.deepEqual(
			diagnostics.map((diagnostic) => diagnostic.labels[0].span.line),
			[2, 5, 7, 8, 12, 14, 15],
		);
	} finally {
		rmSync(directory, { recursive: true, force: true });
	}
});
