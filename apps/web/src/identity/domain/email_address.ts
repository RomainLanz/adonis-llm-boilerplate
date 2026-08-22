import { ValueObject } from '#core/domain/value_object';
import { err, ok, type Result } from '#core/result';

interface EmailAddressProperties {
	value: string;
}

export interface InvalidEmailAddressError {
	type: 'invalid_email_address';
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MAX_EMAIL_LENGTH = 254;

export class EmailAddress extends ValueObject<EmailAddressProperties> {
	static create(value: string): Result<EmailAddress, InvalidEmailAddressError> {
		const normalizedValue = value.trim().toLowerCase();

		if (normalizedValue.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(normalizedValue)) {
			return err({ type: 'invalid_email_address' });
		}

		return ok(new EmailAddress({ value: normalizedValue }));
	}

	toString() {
		return this.props.value;
	}
}
