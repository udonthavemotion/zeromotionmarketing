import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';

export default [
	{
		ignores: ['dist', 'node_modules', 'test-results', 'playwright-report', 'coverage', '.vercel', '.astro', '**/*.astro']
	},
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		plugins: { '@typescript-eslint': tseslint },
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {},
	},
	{
		files: ['**/*.astro'],
		plugins: { astro },
		languageOptions: { parser: astroParser },
		rules: {},
	},
];

