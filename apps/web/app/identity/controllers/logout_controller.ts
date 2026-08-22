import type { HttpContext } from '@adonisjs/core/http';

export default class LogoutController {
	async execute({ auth, response }: HttpContext) {
		await auth.use('web').logout();
		return response.redirect().toRoute('session.create');
	}
}
