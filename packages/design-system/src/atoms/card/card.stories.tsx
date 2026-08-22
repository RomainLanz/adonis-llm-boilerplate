import { Card } from './card';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Atoms/Card',
	component: Card,
	args: { children: 'A reusable surface for grouped content.' },
	argTypes: {
		padding: { control: 'select', options: ['none', 'small', 'medium', 'large'] },
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LargePadding: Story = { args: { padding: 'large' } };
