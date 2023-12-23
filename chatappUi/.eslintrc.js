module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-inline-styles': 0,
        'spaced-comment': ['error', 'always'],
        'no-multi-spaces': 'error',
        'no-whitespace-before-property': 'error',
        'space-before-function-paren': 'error',
        'no-duplicate-imports': 'error',
        'object-curly-spacing': ['error', 'always'],
        'prettier/prettier': 0,
      },
    },
  ],
};
