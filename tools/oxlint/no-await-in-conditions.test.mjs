import { RuleTester } from 'eslint';
import plugin from './tenkai.ts';

const tester = new RuleTester();

tester.run('no-await-in-conditions', plugin.rules['no-await-in-conditions'], {
	valid: [
		'const persisted = await save(); if (!persisted) { stop(); }',
		'if (ready) { await save(); } else { await cancel(); }',
		'const destination = ready ? await load() : undefined;',
		'configure({ destination: ready ? await load() : undefined });',
		'while (ready) { await tick(); }',
		'do { await tick(); } while (ready);',
		'for (let value = await first(); ready; value = await next()) { consume(value); }',
		'for await (const value of stream) { consume(value); }',
		'if (items.some(async () => await check())) { use(); }',
		'if (items.some(async function () { return await check(); })) { use(); }',
	],
	invalid: [
		'if (await check()) { use(); }',
		'if (!(await save())) { stop(); }',
		'if ((await load()).ready) { use(); }',
		'if (ready && await check()) { use(); }',
		'if (ready || await check()) { use(); }',
		'if ((ready ? await check() : false)) { use(); }',
		'if (ready) {} else if (await check()) {}',
		'while (await check()) { use(); }',
		'do { use(); } while (await check());',
		'for (; await check(); ) { use(); }',
		'const value = await check() ? yes : no;',
		'configure({ value: await check() ? yes : no });',
		'if (items.some(async () => { if (await check()) { return true; } })) {}',
	].map((code) => ({ code, output: null, errors: [{ messageId: 'extract' }] })),
});
