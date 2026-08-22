import { ark } from '@ark-ui/react/factory';
import { type ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
	base: 'rounded-control focus-visible:ring-accent/40 focus-visible:ring-offset-surface inline-flex cursor-pointer items-center justify-center font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		intent: {
			primary: 'bg-accent text-accent-ink hover:bg-accent-hover shadow-sm',
			secondary: 'border-border bg-surface text-ink hover:bg-surface-muted border shadow-sm',
		},
		size: {
			small: 'h-9 px-3 text-sm',
			medium: 'h-10 px-4 text-sm',
			large: 'h-12 px-5 text-base',
		},
	},
	defaultVariants: {
		intent: 'primary',
		size: 'medium',
	},
});

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps extends ComponentPropsWithRef<typeof ark.button>, ButtonVariants {
	loading?: boolean;
}

export function Button({
	asChild,
	children,
	className,
	disabled,
	intent,
	loading = false,
	size,
	type,
	...props
}: ButtonProps) {
	if (asChild) {
		return (
			<ark.button asChild className={button({ intent, size, className })} {...props}>
				{children}
			</ark.button>
		);
	}

	return (
		<ark.button
			type={type ?? 'button'}
			aria-busy={loading || undefined}
			disabled={disabled || loading}
			className={button({ intent, size, className })}
			{...props}
		>
			{loading && (
				<span
					aria-hidden="true"
					className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
				/>
			)}
			{children}
		</ark.button>
	);
}
