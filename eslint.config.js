// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
	stylistic: {
		indent: 'tab',
		quotes: 'single',
	},
	vue: false,
	yaml: false,
	ignores: ['dist', 'reports', 'converage'],
})
