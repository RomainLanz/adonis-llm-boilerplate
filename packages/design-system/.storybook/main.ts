import TailwindCSS from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: ['@chromatic-com/storybook'],
	framework: '@storybook/react-vite',
	viteFinal(config) {
		config.plugins ??= [];
		config.plugins.push(TailwindCSS());
		return config;
	},
};

export default config;
