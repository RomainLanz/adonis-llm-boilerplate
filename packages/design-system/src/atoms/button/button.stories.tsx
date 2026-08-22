import { Button } from './button';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Atoms/Button',
	component: Button,
	args: { children: 'Continue' },
	argTypes: {
		intent: { control: 'select', options: ['primary', 'secondary'] },
		size: { control: 'select', options: ['small', 'medium', 'large'] },
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { intent: 'secondary' } };
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const AsLink: Story = {
	render: (args) => (
		<Button {...args} asChild>
			<a href="#button-link">Continue as a link</a>
		</Button>
	),
};
