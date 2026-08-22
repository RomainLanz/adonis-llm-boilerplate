import { inject } from '@adonisjs/core';
import vine from '@vinejs/vine';
import { VerifyUserCredentials } from '#identity/actions/verify_user_credentials';
import type { HttpContext } from '@adonisjs/core/http';

@inject()
export default class LoginController {
	static readonly validator = vine.create({
		email: vine.string().trim().email().maxLength(254),
		password: vine.string().minLength(8).maxLength(72),
	});

	constructor(private readonly verifyUserCredentials: VerifyUserCredentials) {}

	render({ inertia }: HttpContext) {
		return inertia.render('auth/login', {});
	}

	async execute({ request, response, auth, session }: HttpContext) {
		const params = await request.validateUsing(LoginController.validator);
		const result = await this.verifyUserCredentials.execute(params);

		if (!result.ok) {
			session.flash('error', 'Invalid credentials');
			return response.redirect().back();
		}

		await auth.use('web').login(result.value);
		return response.redirect().toRoute('home');
	}
}
