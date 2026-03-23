import { createRequire } from 'module'
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import unocss from '@unocss/eslint-config/flat'

const require = createRequire(import.meta.url)
const autoImportGlobals = require('./.eslintrc-auto-import.json')

export default [
  {
    ignores: ['node_modules/**', 'dist/**', '.eslintrc-auto-import.json'],
  },
  ...pluginVue.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  unocss,
  {
    languageOptions: {
      globals: autoImportGlobals.globals,
    },
    rules: {
      'vue/custom-event-name-casing': [2, 'camelCase'],
      'eqeqeq': ['error', 'always'],
      'spaced-comment': [
        1,
        'always',
        {
          line: { markers: ['/'], exceptions: ['-', '+'] },
          block: { markers: ['!'], exceptions: ['*'], balanced: true },
        },
      ],
      'prettier/prettier': [
        'warn',
        {
          useTabs: false,
          singleQuote: true,
          tabWidth: 2,
          semi: false,
          arrowParens: 'avoid',
          printWidth: 90,
          endOfLine: 'lf',
          trailingComma: 'es5',
          quoteProps: 'consistent',
          htmlWhitespaceSensitivity: 'strict',
        },
      ],
    },
  },
]
