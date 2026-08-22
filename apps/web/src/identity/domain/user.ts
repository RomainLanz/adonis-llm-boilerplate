import { Entity } from '#core/domain/entity';
import type { EmailAddress } from '#identity/domain/email_address';
import type { UserIdentifier } from '#identity/domain/user_identifier';

export interface UserProperties {
	id: UserIdentifier;
	name: string | null;
	email: EmailAddress;
	passwordHash: string;
	createdAt: Date;
	updatedAt: Date | null;
}

export class User extends Entity<UserProperties> {
	get id() {
		return this.getIdentifier().toString();
	}

	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email.toString();
	}

	get emailAddress() {
		return this.props.email;
	}

	get passwordHash() {
		return this.props.passwordHash;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(properties: UserProperties) {
		return new User(properties);
	}
}
