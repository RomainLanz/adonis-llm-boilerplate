import { Form, Link } from '@adonisjs/inertia/react';
import { Button } from '@boilerplate/design-system/button';
import { Field } from '@boilerplate/design-system/field';
import { Head } from '@inertiajs/react';
import { AuthShell } from '~/components/auth-shell';

export default function Login() {
	return (
		<>
			<Head title="Log in" />
			<AuthShell
				eyebrow="Welcome back"
				title="Pick up where you left off."
				description="Sign in to your workspace and keep building with a focused, dependable full-stack foundation."
				footer={
					<>
						New here?{' '}
						<Link route="new_account.create" className="text-accent hover:text-accent-hover font-semibold">
							Create an account
						</Link>
					</>
				}
			>
				<div className="mb-7">
					<h2 className="text-ink text-2xl font-bold tracking-tight">Log in</h2>
					<p className="text-muted mt-2 text-sm">Enter your details to access your account.</p>
				</div>

				<Form route="session.store">
					{({ errors, processing }) => (
						<div className="space-y-5">
							<Field label="Email" error={errors.email} type="email" name="email" autoComplete="username" required />

							<Field
								label="Password"
								error={errors.password}
								type="password"
								name="password"
								autoComplete="current-password"
								required
							/>

							<Button type="submit" size="large" loading={processing} className="w-full">
								{processing ? 'Logging in…' : 'Log in'}
							</Button>
						</div>
					)}
				</Form>
			</AuthShell>
		</>
	);
}
