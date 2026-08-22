import fs from 'node:fs/promises';
import path from 'node:path';
import { BaseCommand } from '@adonisjs/core/ace';
import { Migrator } from 'kysely/migration';
import { FileMigrationProvider } from '#shared/file_migration_provider';
import { db } from '#shared/services/db';
import type { CommandOptions } from '@adonisjs/core/types/ace';

export default class Migrate extends BaseCommand {
	static commandName = 'migrate';
	static description = 'Execute pending Kysely migrations';
	static options: CommandOptions = { startApp: true };

	async run() {
		const migrator = new Migrator({
			db,
			provider: new FileMigrationProvider({ fs, path, migrationFolder: this.app.migrationsPath() }),
		});
		const { error, results } = await migrator.migrateToLatest();
		results?.forEach((result) => this.logger.info(`${result.migrationName}: ${result.status}`));

		if (error) {
			this.error = error;
			this.exitCode = 1;
		}
	}
}
