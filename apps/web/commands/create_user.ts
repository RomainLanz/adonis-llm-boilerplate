import { BaseCommand, flags } from '@adonisjs/core/ace';
import { RegisterUser, type RegisterUserError } from '#identity/actions/register_user';
import type { CommandOptions } from '@adonisjs/core/types/ace';

const errorMessages = {
	invalid_email_address: 'The email address is invalid',
	invalid_password: 'The password must contain between 8 and 72 characters',
	email_already_taken: 'A user already exists for this email address',
} satisfies Record<RegisterUserError['type'], string>;

export default class CreateUser extends BaseCommand {
	static commandName = 'create:user';
	static description = 'Create a user with an email and password';
	static options: CommandOptions = { startApp: true };

	@flags.string({ description: 'User name' })
	declare name?: string;

	@flags.string({ description: 'User email' })
	declare email?: string;

	@flags.string({ description: 'User password' })
	declare password?: string;

	async run() {
		const name = this.name ?? (await this.prompt.ask<string>('What is the user name?'));
		const email = this.email ?? (await this.prompt.ask<string>('What is the user email?'));
		const password = this.password ?? (await this.prompt.secure<string>('What is the user password?'));
		const registerUser = await this.app.container.make(RegisterUser);
		const result = await registerUser.execute({
			name,
			email,
			password,
		});

		if (!result.ok) {
			this.logger.error(errorMessages[result.error.type]);
			this.exitCode = 1;
			return;
		}

		this.logger.success(`User ${result.value.email} created successfully`);
		this.logger.info(`User ID: ${result.value.id}`);
	}
}
