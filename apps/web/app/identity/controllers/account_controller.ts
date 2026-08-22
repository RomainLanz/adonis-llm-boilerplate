import { inject } from '@adonisjs/core';
import AccountDetailsTransformer from '#app/identity/transformers/account_details_transformer';
import { AccountDetailsQuery } from '#identity/queries/account_details_query';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class AccountController {
	constructor(private readonly accountDetails: AccountDetailsQuery) {}

	async render({ auth, inertia, response }: HttpContext) {
		const user = auth.getUserOrFail();
		const account = await this.accountDetails.execute(user.getIdentifier());

		if (!account) {
			return response.notFound();
		}

		return inertia.render('account/show', {
			account: AccountDetailsTransformer.transform(account),
		});
	}
}
