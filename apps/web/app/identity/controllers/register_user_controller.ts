import { inject } from '@adonisjs/core';
import vine from '@vinejs/vine';
import { RegisterUser } from '#identity/actions/register_user';
import type { HttpContext } from '@adonisjs/core/http';

const errorMessages = {
	invalid_email_address: 'The email address is invalid',
	invalid_password: 'The password must contain between 8 and 72 characters',
	email_already_taken: 'An account already exists for this email',
} as const;

@inject()
export default class RegisterUserController {
	static readonly validator = vine.create({
		name: vine.string().nullable(),
		email: vine.string().trim().email().maxLength(254),
		password: vine.string().minLength(8).maxLength(72).confirmed({
			confirmationField: 'passwordConfirmation',
		}),
	});

	constructor(private readonly registerUser: RegisterUser) {}

	render({ inertia }: HttpContext) {
		return inertia.render('auth/signup', {});
	}

	async execute({ request, response, auth, session }: HttpContext) {
		const params = await request.validateUsing(RegisterUserController.validator);
		const result = await this.registerUser.execute(params);

		if (!result.ok) {
			session.flash('error', errorMessages[result.error.type]);
			return response.redirect().back();
		}

		await auth.use('web').login(result.value);
		return response.redirect().toRoute('home');
	}
}
