import reactHooks from 'eslint-plugin-react-hooks';

const browserGlobals = [
  'Blob', 'FileReader', 'FormData', 'Image', 'IntersectionObserver', 'URL',
  'URLSearchParams', 'cancelAnimationFrame', 'clearInterval', 'clearTimeout',
  'console', 'document', 'fetch', 'localStorage', 'navigator', 'performance',
  'queueMicrotask', 'requestAnimationFrame', 'sessionStorage', 'setInterval',
  'setTimeout', 'window',
];

export default [
  { ignores: ['dist/**'] },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: Object.fromEntries(browserGlobals.map((name) => [name, 'readonly'])),
    },
    plugins: { 'react-hooks': reactHooks },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    rules: {
      'no-undef': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
];
