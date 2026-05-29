import globals from 'globals';
import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintReactRefresh from 'eslint-plugin-react-refresh';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Main configuration for source files
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ignores: [
      'dist/**',
      'node_modules/**',
      '.git/**',
      'coverage/**',
      'playwright.config.ts',
      'tests/**',
      '__inbox/**',
      'doc/**',
      'out/**',
      'worktrees/**',
      'sub-packages/**',
      'zfb-app/**',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '19.0' } },
    plugins: {
      '@typescript-eslint': typescript,
      react: eslintReact,
      'react-hooks': eslintReactHooks,
      'react-refresh': eslintReactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      ...eslintReact.configs.recommended.rules,
      ...eslintReact.configs['jsx-runtime'].rules,
      ...eslintReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          allowExportNames: ['useNavigation'],
        },
      ],
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      ...eslintConfigPrettier.rules,
    },
  },
  // Configuration for Node.js config files
  {
    files: ['*.config.js', '*.config.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.node },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // Node.js globals
      ...eslintConfigPrettier.rules,
    },
  },
  // Configuration for Playwright config and test files
  {
    files: [
      'playwright.config.ts',
      'playwright.config.production.ts',
      'tests/**/*.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      ...eslintConfigPrettier.rules,
    },
  },
  // Configuration for Vitest test files and setup
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/setup.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node, vi: 'readonly', global: 'writable' },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // Allow vitest globals like vi
      ...eslintConfigPrettier.rules,
    },
  },
];
