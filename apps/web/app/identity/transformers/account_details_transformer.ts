import { BaseTransformer } from '@adonisjs/core/transformers';
import type { AccountDetails } from '#identity/queries/account_details_query';

export default class AccountDetailsTransformer extends BaseTransformer<AccountDetails> {
	toObject() {
		return this.pick(this.resource, ['id', 'name', 'email', 'createdAt']);
	}
}
