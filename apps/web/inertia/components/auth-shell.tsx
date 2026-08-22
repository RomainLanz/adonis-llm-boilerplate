import { Card } from '@boilerplate/design-system/card';
import { type ReactNode } from 'react';

interface AuthShellProps {
	eyebrow: string;
	title: string;
	description: string;
	children: ReactNode;
	footer: ReactNode;
}

export function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
	return (
		<main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_28rem] lg:px-8 lg:py-16">
			<section className="max-w-xl lg:pr-10">
				<p className="text-accent mb-4 text-sm font-semibold tracking-wide uppercase">{eyebrow}</p>
				<h1 className="text-ink text-4xl leading-tight font-bold tracking-tight sm:text-5xl">{title}</h1>
				<p className="text-muted mt-5 max-w-lg text-lg leading-8">{description}</p>

				<ul className="text-muted marker:text-accent mt-8 hidden space-y-3 text-sm lg:block lg:list-disc lg:pl-5">
					<li>Typed routes from server to client</li>
					<li>A shared, accessible design system</li>
					<li>Production-ready defaults without the clutter</li>
				</ul>
			</section>

			<Card asChild className="sm:p-8">
				<section>
					{children}
					<div className="border-border text-muted mt-7 border-t pt-6 text-center text-sm">{footer}</div>
				</section>
			</Card>
		</main>
	);
}
