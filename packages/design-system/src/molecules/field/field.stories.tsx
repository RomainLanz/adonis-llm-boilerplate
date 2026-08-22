import { Field } from './field';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Molecules/Field',
	component: Field,
	args: {
		label: 'Email',
		type: 'email',
		placeholder: 'you@example.com',
		rootClassName: 'w-80',
	},
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { error: 'Enter a valid email address.' } };
export const Disabled: Story = { args: { disabled: true } };
