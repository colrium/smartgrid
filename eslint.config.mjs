import { defineConfig } from 'eslint/config';
import pluginNext from 'eslint-config-next';
import pluginUnusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
	...pluginNext.flat(),
	{
		// Vendored static assets are never part of the app bundle — skip linting
		// them (public/draco ships minified third-party decoder output).
		// Build output dirs are generated artifacts; the ".next*" glob also
		// covers verification builds that redirect distDir via NEXT_DIST_DIR
		// (e.g. ".next-dev"). Gitignored IDE-agent worktrees (".kilo/**")
		// duplicate the whole repo incl. minified assets — never lint them.
		ignores: ["public/**", ".next*/**", ".kilo/**"],
	},
	{
		plugins: {
			"unused-imports": pluginUnusedImports,
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