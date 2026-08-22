import { Card } from '@boilerplate/design-system/card';
import { type Data } from '@generated/data';
import { Head } from '@inertiajs/react';
import { type InertiaProps } from '~/types';

type PageProps = InertiaProps<{ account: Data.Identity.AccountDetails }>;

export default function ShowAccount({ account, user }: PageProps) {
	const displayName = account.name ?? account.email;

	return (
		<>
			<Head title="Account" />
			<main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
				<header className="mb-8">
					<p className="text-accent text-sm font-semibold tracking-wide uppercase">Your workspace</p>
					<h1 className="text-ink mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Account</h1>
					<p className="text-muted mt-3">Review the identity attached to this starter workspace.</p>
				</header>

				<Card asChild padding="none" className="overflow-hidden">
					<section>
						<div className="border-border flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
							<div className="flex items-center gap-4">
								<div className="bg-accent-soft text-accent flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-bold">
									{user?.initials}
								</div>
								<div>
									<h2 className="text-ink text-lg font-semibold">{displayName}</h2>
									<p className="text-muted text-sm">Active member</p>
								</div>
							</div>
							<span className="bg-mint-soft text-mint w-fit rounded-full px-3 py-1 text-xs font-bold uppercase">
								Verified
							</span>
						</div>

						<dl className="bg-border grid gap-px sm:grid-cols-2">
							<div className="bg-surface p-6 sm:p-8">
								<dt className="text-muted text-sm font-medium">Email address</dt>
								<dd className="text-ink mt-2 font-semibold break-all">{account.email}</dd>
							</div>
							<div className="bg-surface p-6 sm:p-8">
								<dt className="text-muted text-sm font-medium">Member since</dt>
								<dd className="text-ink mt-2 font-semibold">
									{new Date(account.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
								</dd>
							</div>
						</dl>
					</section>
				</Card>
			</main>
		</>
	);
}
