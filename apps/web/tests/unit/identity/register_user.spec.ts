import { test } from '@japa/runner';
import { ok } from '#core/result';
import { RegisterUser } from '#identity/actions/register_user';
import { EmailAddress } from '#identity/domain/email_address';
import { User } from '#identity/domain/user';
import type { UserIdentifier } from '#identity/domain/user_identifier';
import type { UserRepository } from '#identity/repositories/user_repository';
import type { TransactionManager } from '#shared/services/transaction_manager';

interface CreateUserPayload {
	id: UserIdentifier;
	name: string | null;
	email: EmailAddress;
	passwordHash: string;
}

test.group('RegisterUser', () => {
	test('rejects an invalid email before starting a transaction', async ({ assert }) => {
		let transactionStarted = false;
		const transactions: TransactionManager = {
			run() {
				transactionStarted = true;
				throw new Error('The transaction should not start');
			},
			currentDatabase() {
				throw new Error('The database should not be accessed');
			},
		};
		// SAFETY: Invalid input returns before RegisterUser can access the repository.
		const registerUser = new RegisterUser({} as UserRepository, transactions);

		const result = await registerUser.execute({
			name: 'Ada Lovelace',
			email: 'not-an-email',
			password: 'a-secure-password',
		});

		assert.deepEqual(result, { ok: false, error: { type: 'invalid_email_address' } });
		assert.isFalse(transactionStarted);
	});

	test('rejects a password outside the policy before starting a transaction', async ({ assert }) => {
		let transactionStarted = false;
		const transactions: TransactionManager = {
			run() {
				transactionStarted = true;
				throw new Error('The transaction should not start');
			},
			currentDatabase() {
				throw new Error('The database should not be accessed');
			},
		};
		// SAFETY: Invalid input returns before RegisterUser can access the repository.
		const registerUser = new RegisterUser({} as UserRepository, transactions);

		const result = await registerUser.execute({
			name: 'Ada Lovelace',
			email: 'ada@example.com',
			password: 'short',
		});

		assert.deepEqual(result, { ok: false, error: { type: 'invalid_password' } });
		assert.isFalse(transactionStarted);
	});

	test('normalizes user data before persistence', async ({ assert }) => {
		let receivedPayload: CreateUserPayload | undefined;
		// SAFETY: RegisterUser only calls `createUser` on its repository dependency.
		const users = {
			createUser(payload: CreateUserPayload) {
				receivedPayload = payload;
				return Promise.resolve(
					ok(
						User.create({
							...payload,
							createdAt: new Date('2026-01-01T00:00:00Z'),
							updatedAt: null,
						}),
					),
				);
			},
		} as UserRepository;
		// SAFETY: RegisterUser only calls `run` on its transaction dependency.
		const transactions = {
			run<T>(callback: () => Promise<T>) {
				return callback();
			},
		} as TransactionManager;
		const registerUser = new RegisterUser(users, transactions);

		const result = await registerUser.execute({
			name: '  Ada Lovelace  ',
			email: '  ADA@EXAMPLE.COM  ',
			password: 'a-secure-password',
		});

		assert.isTrue(result.ok);
		assert.equal(receivedPayload?.name, 'Ada Lovelace');
		assert.equal(receivedPayload?.email.toString(), 'ada@example.com');
		assert.notEqual(receivedPayload?.passwordHash, 'a-secure-password');
	});
});
