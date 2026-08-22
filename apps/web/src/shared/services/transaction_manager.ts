import { AsyncLocalStorage } from 'node:async_hooks';
import { db } from '#shared/services/db';
import type { DB } from '#types/db';
import type { Kysely, Transaction } from 'kysely';

type DatabaseConnection = Kysely<DB> | Transaction<DB>;

export class TransactionManager {
	static readonly #storage = new AsyncLocalStorage<Transaction<DB>>();

	run<T>(callback: () => Promise<T>) {
		const activeTransaction = TransactionManager.#storage.getStore();

		if (activeTransaction) {
			return callback();
		}

		return db.transaction().execute((transaction) => {
			return TransactionManager.#storage.run(transaction, callback);
		});
	}

	currentDatabase(): DatabaseConnection {
		return TransactionManager.#storage.getStore() ?? db;
	}
}
