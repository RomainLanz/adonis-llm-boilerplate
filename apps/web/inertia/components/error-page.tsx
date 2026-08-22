import { Link } from '@adonisjs/inertia/react';
import { Button } from '@boilerplate/design-system/button';
import { Card } from '@boilerplate/design-system/card';

interface ErrorPageProps {
	status: '404' | '500';
	title: string;
	description: string;
}

export function ErrorPage({ status, title, description }: ErrorPageProps) {
	return (
		<main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-3xl items-center px-4 py-16 sm:px-6">
			<Card asChild padding="large" className="w-full text-center sm:p-12">
				<section>
					<p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase">Error {status}</p>
					<h1 className="text-ink mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
					<p className="text-muted mx-auto mt-4 max-w-md leading-7">{description}</p>
					<Button asChild className="mt-8">
						<Link route="home">Back to home</Link>
					</Button>
				</section>
			</Card>
		</main>
	);
}
