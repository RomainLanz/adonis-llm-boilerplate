import { pathToFileURL } from 'node:url';
import type { FileMigrationProviderProps, Migration, MigrationProvider } from 'kysely/migration';

export class FileMigrationProvider implements MigrationProvider {
	constructor(private readonly props: FileMigrationProviderProps) {}

	async getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {};
		const files = await this.props.fs.readdir(this.props.migrationFolder);

		for (const fileName of files) {
			if (!/\.(?:[cm]?[jt]s)$/.test(fileName) || fileName.endsWith('.d.ts')) {
				continue;
			}
			const path = pathToFileURL(this.props.path.join(this.props.migrationFolder, fileName));
			const migration = await import(path.href);

			if (migration.up instanceof Function) {
				// SAFETY: A Kysely migration only requires an `up` function; `down` is optional.
				migrations[fileName.slice(0, fileName.lastIndexOf('.'))] = migration;
			}
		}
		return migrations;
	}
}
