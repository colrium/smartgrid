import { defineConfig } from 'eslint/config';
import pluginNext from 'eslint-config-next';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  ...pluginNext.flat(),
  {
    plugins: {
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);