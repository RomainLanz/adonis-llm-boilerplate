import { test } from '@japa/runner';
import { EmailAddress } from '#identity/domain/email_address';
import { User } from '#identity/domain/user';
import { UserIdentifier } from '#identity/domain/user_identifier';

function makeUser(id: string, email = 'ada@example.com') {
	const emailAddress = EmailAddress.create(email);

	if (!emailAddress.ok) {
		throw new Error('The test email address must be valid');
	}

	return User.create({
		id: UserIdentifier.fromString(id),
		name: 'Ada Lovelace',
		email: emailAddress.value,
		passwordHash: 'hashed',
		createdAt: new Date('2026-01-01T00:00:00Z'),
		updatedAt: null,
	});
}

test.group('User', () => {
	test('compares entities by their typed identifier', ({ assert }) => {
		const id = '1d4434c9-aa87-4c2d-891c-dd2e56644d94';

		assert.isTrue(makeUser(id).equals(makeUser(id, 'updated@example.com')));
		assert.isFalse(makeUser(id).equals(makeUser('40250e58-3e69-4ae9-8f75-e95b96462826')));
	});
});
