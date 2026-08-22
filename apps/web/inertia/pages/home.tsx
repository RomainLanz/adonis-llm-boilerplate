import { Link } from '@adonisjs/inertia/react';
import { Button } from '@boilerplate/design-system/button';
import { Card } from '@boilerplate/design-system/card';
import { Head } from '@inertiajs/react';
import { type InertiaProps } from '~/types';

export default function Home({ user }: InertiaProps) {
	return (
		<>
			<Head title="A thoughtful AdonisJS starter" />
			<main className="flex-1">
				<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
					<div className="mx-auto max-w-4xl text-center">
						<p className="bg-lavender-soft text-lavender inline-flex rounded-full px-3 py-1 text-sm font-semibold">
							AdonisJS · React · Inertia
						</p>
						<h1 className="text-ink mt-6 text-4xl leading-tight font-bold tracking-tight sm:text-6xl">
							A calm foundation for ambitious products.
						</h1>
						<p className="text-muted mx-auto mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
							A full-stack starter with typed boundaries, useful defaults, and a design system that already feels like a
							real product.
						</p>
						<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
							<Button asChild size="large">
								<Link route={user ? 'account.show' : 'new_account.create'}>
									{user ? 'View your account' : 'Create an account'}
								</Link>
							</Button>
							<Button asChild size="large" intent="secondary">
								<a href="https://docs.adonisjs.com/introduction" target="_blank" rel="noreferrer">
									Read the documentation
								</a>
							</Button>
						</div>
					</div>

					<div className="mt-16 grid gap-4 md:grid-cols-3">
						<Card asChild>
							<article>
								<p className="bg-mint-soft text-mint inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase">
									Backend
								</p>
								<h2 className="text-ink mt-5 text-xl font-semibold">AdonisJS, fully structured</h2>
								<p className="text-muted mt-2 leading-7">
									Clear application boundaries, typed routes, authentication, and PostgreSQL persistence.
								</p>
							</article>
						</Card>

						<Card asChild>
							<article>
								<p className="bg-accent-soft text-accent inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase">
									Frontend
								</p>
								<h2 className="text-ink mt-5 text-xl font-semibold">React without the split</h2>
								<p className="text-muted mt-2 leading-7">
									Inertia keeps routing server-driven while delivering a fast, cohesive React experience.
								</p>
							</article>
						</Card>

						<Card asChild>
							<article>
								<p className="bg-peach-soft text-peach inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase">
									Interface
								</p>
								<h2 className="text-ink mt-5 text-xl font-semibold">A design system included</h2>
								<p className="text-muted mt-2 leading-7">
									Accessible primitives, shared tokens, Storybook, and Tailwind utilities ready to evolve.
								</p>
							</article>
						</Card>
					</div>
				</section>

				<section className="border-border bg-surface border-y">
					<div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
						<div>
							<h2 className="text-ink text-2xl font-bold tracking-tight">From clone to first feature, faster.</h2>
							<p className="text-muted mt-2">
								Start with strong conventions, then make the product unmistakably yours.
							</p>
						</div>
						<Link
							route={user ? 'account.show' : 'session.create'}
							className="text-accent hover:text-accent-hover font-semibold transition-colors"
						>
							{user ? 'Open your account →' : 'Explore the starter →'}
						</Link>
					</div>
				</section>
			</main>
		</>
	);
}
