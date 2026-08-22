import { Form, Link } from '@adonisjs/inertia/react';
import { Button } from '@boilerplate/design-system/button';
import { Field } from '@boilerplate/design-system/field';
import { Head } from '@inertiajs/react';
import { AuthShell } from '~/components/auth-shell';

export default function Signup() {
	return (
		<>
			<Head title="Create account" />
			<AuthShell
				eyebrow="Start building"
				title="Your next product starts here."
				description="Create your account and explore a clean AdonisJS foundation designed for real product work."
				footer={
					<>
						Already have an account?{' '}
						<Link route="session.create" className="text-accent hover:text-accent-hover font-semibold">
							Log in
						</Link>
					</>
				}
			>
				<div className="mb-7">
					<h2 className="text-ink text-2xl font-bold tracking-tight">Create your account</h2>
					<p className="text-muted mt-2 text-sm">A few details and you’ll be ready to go.</p>
				</div>

				<Form route="new_account.store">
					{({ errors, processing }) => (
						<div className="space-y-5">
							<Field label="Name" error={errors.name} type="text" name="name" autoComplete="name" required />

							<Field label="Email" error={errors.email} type="email" name="email" autoComplete="email" required />

							<Field
								label="Password"
								error={errors.password}
								type="password"
								name="password"
								autoComplete="new-password"
								required
							/>

							<Field
								label="Confirm password"
								invalid={Boolean(errors.password)}
								type="password"
								name="passwordConfirmation"
								autoComplete="new-password"
								required
							/>

							<Button type="submit" size="large" loading={processing} className="w-full">
								{processing ? 'Creating account…' : 'Create account'}
							</Button>
						</div>
					)}
				</Form>
			</AuthShell>
		</>
	);
}
