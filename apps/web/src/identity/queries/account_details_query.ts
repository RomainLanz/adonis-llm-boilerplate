import { inject } from '@adonisjs/core';
import { TransactionManager } from '#shared/services/transaction_manager';
import type { UserIdentifier } from '#identity/domain/user_identifier';

export interface AccountDetails {
	id: string;
	name: string | null;
	email: string;
	createdAt: Date;
}

@inject()
export class AccountDetailsQuery {
	constructor(private readonly transactions: TransactionManager) {}

	async execute(userId: UserIdentifier): Promise<AccountDetails | null> {
		const account = await this.transactions
			.currentDatabase()
			.selectFrom('users')
			.select(['id', 'name', 'email', 'created_at'])
			.where('id', '=', userId.toString())
			.executeTakeFirst();

		return account
			? {
					id: account.id,
					name: account.name,
					email: account.email,
					createdAt: account.created_at,
				}
			: null;
	}
}
