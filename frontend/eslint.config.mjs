// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Project-specific rules
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Disallow `as any` via AST selector for TS `as` expressions with `any` type
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSAsExpression[typeAnnotation.type='TSAnyKeyword']",
          message:
            'Do not use `as any`. Prefer explicit types, `unknown` + guards, or update the API types.',
        },
      ],
      // Also enforce no explicit `any` usage generally
      '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],

      // Disable base rule and use the TypeScript-aware rule for unused variables
      'no-unused-vars': 'off',
      // We'll use eslint-plugin-unused-imports to auto-fix/remove unused imports/vars
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
