module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    jest: true,
    'react-native/react-native': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', '@typescript-eslint', 'react-hooks', 'import'],
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
