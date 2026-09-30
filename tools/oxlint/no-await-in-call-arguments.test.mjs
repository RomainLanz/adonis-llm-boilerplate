import { RuleTester } from 'eslint';
import plugin from './tenkai.ts';

const tester = new RuleTester();

tester.run('no-await-in-call-arguments', plugin.rules['no-await-in-call-arguments'], {
	valid: [
		'const result = await load(); consume(result);',
		'await save();',
		'async function run() { return await load(); }',
		'consume(load());',
		'const result = (await load()).value;',
		'(await factory()).execute();',
		'(await factory())();',
		'consume(async () => await load());',
		'consume(async function () { return await load(); });',
		'consume({ async load() { return await fetchData(); } });',
		'consume(async () => { const result = await load(); return transform(result); });',
		'consume({ value: await load() });',
		'consume({ logger: { destination: ready ? await load() : undefined } });',
		'new Consumer({ value: await load() });',
	],
	invalid: [
		'consume(await load());',
		'consume({ value: normalize(await load()) });',
		'consume({ [await load()]: value });',
		'consume({ [key]: await load() });',
		'consume([await load()]);',
		'consume(...await load());',
		'consume({ ...await load() });',
		'consume(ready ? await load() : cached);',
		'consume(ready && await load());',
		'consume((await load()).value);',
		'consume((await factory()).execute());',
		'consume?.(await load());',
		'new Consumer(await load());',
		'await consume(await load());',
		'outer(inner(await load()));',
		'consume(async () => transform(await load()));',
	].map((code) => ({ code, output: null, errors: [{ messageId: 'extract' }] })),
});
