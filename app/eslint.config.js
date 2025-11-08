// eslint.config.js
const tseslint = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')
const prettierPlugin = require('eslint-plugin-prettier')
const importPlugin = require('eslint-plugin-import')
const importResolverTS = require('eslint-import-resolver-typescript')
const securityPlugin = require('eslint-plugin-security')
const sonarPlugin = require('eslint-plugin-sonarjs')
const boundariesPlugin = require('eslint-plugin-boundaries')
const nodePlugin = require('eslint-plugin-node')
/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist', 'node_modules', 'coverage', '*.spec.ts'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
      security: securityPlugin,
      sonarjs: sonarPlugin,
      boundaries: boundariesPlugin,
      node: nodePlugin,
    },
    settings: {
      'import/resolver': {
        node: true,
        typescript: importResolverTS,
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-object-injection': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-child-process': 'error',
      'security/detect-object-injection': 'warn',
      'security/detect-child-process': 'error',
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
      '@typescript-eslint/no-floating-promises': 'error',
      'node/no-process-env': 'warn',
      'boundaries/element-types': ['error', { default: 'allow', rules: [] }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports' },
      ],

      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            { pattern: '@nestjs/**', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
            { pattern: '@bdd-backend/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  {
    files: ['src/app/security/audit-logger.service.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]
