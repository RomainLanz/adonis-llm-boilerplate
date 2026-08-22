import { test } from '@japa/runner';
import { EmailAddress } from '#identity/domain/email_address';

test.group('EmailAddress', () => {
	test('normalizes whitespace and casing when created', ({ assert }) => {
		const email = EmailAddress.create('  ADA.Lovelace@Example.COM  ');

		assert.isTrue(email.ok);

		if (email.ok) {
			assert.equal(email.value.toString(), 'ada.lovelace@example.com');
		}
	});

	test('rejects invalid email addresses', ({ assert }) => {
		assert.deepEqual(EmailAddress.create('not-an-email'), {
			ok: false,
			error: { type: 'invalid_email_address' },
		});
	});

	test('compares normalized addresses by value', ({ assert }) => {
		const first = EmailAddress.create('ada@example.com');
		const second = EmailAddress.create(' ADA@EXAMPLE.COM ');

		assert.isTrue(first.ok && second.ok);

		if (first.ok && second.ok) {
			assert.isTrue(first.value.equals(second.value));
		}
	});
});
