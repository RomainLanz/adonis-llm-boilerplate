import { BaseTransformer } from '@adonisjs/core/transformers';
import type { User } from '#identity/domain/user';

export default class UserTransformer extends BaseTransformer<User> {
	toObject() {
		return {
			...this.pick(this.resource, ['id', 'name', 'email', 'createdAt', 'updatedAt']),
			initials: initialsFor(this.resource),
		};
	}
}

function initialsFor(user: User) {
	const parts = (user.name ?? user.email.split('@')[0]).trim().split(/\s+/);
	return (parts.length > 1 ? parts[0][0] + parts.at(-1)![0] : parts[0].slice(0, 2)).toUpperCase();
}
