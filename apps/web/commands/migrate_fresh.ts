import { BaseCommand, flags } from '@adonisjs/core/ace';
import ace from '@adonisjs/core/services/ace';
import { sql } from 'kysely';
import { db } from '#shared/services/db';
import type { CommandOptions } from '@adonisjs/core/types/ace';

export default class MigrateFresh extends BaseCommand {
	static commandName = 'migrate:fresh';
	static description = 'Drop all public tables and rerun migrations';
	static options: CommandOptions = { startApp: true };

	@flags.boolean({ description: 'Allow the command to run in production' })
	declare force: boolean;

	async run() {
		if (this.app.inProduction && !this.force) {
			this.logger.error('The migrate:fresh command is disabled in production without --force');
			this.exitCode = 1;
			return;
		}

		const { rows: tables } = await sql<{ table_name: string }>`
			SELECT table_name
			FROM information_schema.tables
			WHERE table_schema = 'public'
				AND table_type = 'BASE TABLE'
		`.execute(db);

		for (const table of tables) {
			await db.schema.dropTable(table.table_name).ifExists().cascade().execute();
			this.logger.info(`${table.table_name}: dropped`);
		}

		const migrate = await ace.exec('migrate', []);

		if (migrate.exitCode) {
			this.error = migrate.error;
			this.exitCode = migrate.exitCode;
		}
	}
}
