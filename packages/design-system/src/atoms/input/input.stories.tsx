import { Input } from './input';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
	title: 'Atoms/Input',
	component: Input,
	args: { placeholder: 'you@example.com' },
	argTypes: {
		inputSize: { control: 'select', options: ['small', 'medium', 'large'] },
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = {
	args: { defaultValue: 'Not an email' },
	render: (args) => <Input {...args} data-invalid="true" />,
};
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Unavailable' } };
