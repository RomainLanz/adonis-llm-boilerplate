import { inject } from '@adonisjs/core';
import hash from '@adonisjs/core/services/hash';
import { err } from '#core/result';
import { EmailAddress, type InvalidEmailAddressError } from '#identity/domain/email_address';
import { UserIdentifier } from '#identity/domain/user_identifier';
import { UserRepository, type CreateUserError } from '#identity/repositories/user_repository';
import { TransactionManager } from '#shared/services/transaction_manager';
import type { Result } from '#core/result';
import type { User } from '#identity/domain/user';

export interface RegisterUserParams {
	name: string | null;
	email: string;
	password: string;
}

export interface InvalidPasswordError {
	type: 'invalid_password';
}
export type RegisterUserError = CreateUserError | InvalidEmailAddressError | InvalidPasswordError;
export type RegisterUserResult = Result<User, RegisterUserError>;

@inject()
export class RegisterUser {
	constructor(
		private readonly users: UserRepository,
		private readonly transactions: TransactionManager,
	) {}

	async execute(params: RegisterUserParams): Promise<RegisterUserResult> {
		const email = EmailAddress.create(params.email);

		if (!email.ok) {
			return err(email.error);
		}

		if (params.password.length < 8 || params.password.length > 72) {
			return err({ type: 'invalid_password' });
		}

		return this.transactions.run(async () => {
			return this.users.createUser({
				id: UserIdentifier.generate(),
				name: params.name?.trim() || null,
				email: email.value,
				passwordHash: await hash.make(params.password),
			});
		});
	}
}
