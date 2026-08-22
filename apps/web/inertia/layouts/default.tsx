import { Form, Link } from '@adonisjs/inertia/react';
import { Button } from '@boilerplate/design-system/button';
import { usePage } from '@inertiajs/react';
import { type ReactElement, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export default function Layout({ children }: { children: ReactElement }) {
	const { url, flash, props } = usePage();
	useEffect(() => {
		toast.dismiss();
	}, [url]);

	useEffect(() => {
		if (flash.error) {
			toast.error(flash.error);
		}

		if (flash.success) {
			toast.success(flash.success);
		}
	});

	return (
		<div className="bg-canvas text-ink min-h-dvh">
			<header className="border-border bg-surface/95 sticky top-0 z-20 border-b backdrop-blur">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					<Link route="home" className="text-ink text-lg font-bold tracking-tight">
						Adonis Starter
					</Link>

					<nav className="flex items-center gap-2" aria-label="Main navigation">
						{props.user ? (
							<>
								<Link
									route="account.show"
									className="text-muted hover:text-ink rounded-control hidden px-3 py-2 text-sm font-medium transition-colors sm:block"
								>
									Account
								</Link>
								<span
									className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-full text-xs font-bold"
									aria-label="Current user"
								>
									{props.user.initials}
								</span>
								<Form route="session.destroy">
									<Button type="submit" intent="secondary" size="small">
										Log out
									</Button>
								</Form>
							</>
						) : (
							<>
								<Link
									route="session.create"
									className="text-muted hover:text-ink rounded-control hidden px-3 py-2 text-sm font-medium transition-colors sm:block"
								>
									Log in
								</Link>
								<Button asChild size="small">
									<Link route="new_account.create">Get started</Link>
								</Button>
							</>
						)}
					</nav>
				</div>
			</header>
			<div className="flex min-h-[calc(100dvh-4rem)] flex-col">{children}</div>
			<Toaster position="top-center" richColors />
		</div>
	);
}
