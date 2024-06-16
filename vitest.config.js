/* eslint-disable node/prefer-global/process */
/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		reporters: process.env.GITHUB_ACTIONS ? ['json', 'github-actions'] : ['json', 'verbose'],
		outputFile: './reports/test-output.json',
		coverage: {
			provider: 'istanbul',
			reporter: ['json', 'html', 'text'],
			exclude: ['reports'],
		},
	},
})
