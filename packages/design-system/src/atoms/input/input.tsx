import { ark } from '@ark-ui/react/factory';
import { type ComponentPropsWithRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const input = tv({
	base: 'border-border bg-surface text-ink placeholder:text-muted/70 focus:border-accent focus:ring-accent/20 data-[invalid]:border-rose data-[invalid]:focus:border-rose data-[invalid]:focus:ring-rose/20 rounded-control block w-full border transition-shadow outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		inputSize: {
			small: 'h-9 px-3 text-sm',
			medium: 'h-11 px-3.5 text-sm',
			large: 'h-12 px-4 text-base',
		},
	},
	defaultVariants: {
		inputSize: 'medium',
	},
});

type InputVariants = VariantProps<typeof input>;

export interface InputProps extends ComponentPropsWithRef<typeof ark.input>, InputVariants {}

export function Input({ className, inputSize, ...props }: InputProps) {
	return <ark.input className={input({ className, inputSize })} {...props} />;
}
