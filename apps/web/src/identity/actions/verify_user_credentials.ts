import { inject } from '@adonisjs/core';
import hash from '@adonisjs/core/services/hash';
import { err, ok, type Result } from '#core/result';
import { EmailAddress } from '#identity/domain/email_address';
import { UserRepository } from '#identity/repositories/user_repository';
import type { User } from '#identity/domain/user';

export interface VerifyUserCredentialsParams {
	email: string;
	password: string;
}

export interface VerifyUserCredentialsError {
	type: 'invalid_credentials';
}
export type VerifyUserCredentialsResult = Result<User, VerifyUserCredentialsError>;

@inject()
export class VerifyUserCredentials {
	constructor(private readonly users: UserRepository) {}

	async execute(params: VerifyUserCredentialsParams): Promise<VerifyUserCredentialsResult> {
		const email = EmailAddress.create(params.email);
		const user = email.ok ? await this.users.findUserByEmail(email.value) : null;

		if (!user) {
			await hash.make('invalid-password');
			return err({ type: 'invalid_credentials' });
		}

		if (!(await hash.verify(user.passwordHash, params.password))) {
			return err({ type: 'invalid_credentials' });
		}

		return ok(user);
	}
}
