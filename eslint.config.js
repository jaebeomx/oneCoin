import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        // TypeScript 설정을 여기에 추가
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': 'warn', // 미사용 변수 금지 규칙 (warning)
      '@typescript-eslint/no-implicit-any': 'off', // any 타입으로 암시한 표현식과 선언에 오류를 발생시키지 않음

      // 같은 폴더인 경우를 제외하고 import 경로는 항상 절대 경로를 사용
      'import-path/no-relative-import-paths': ['warn', { allowSameFolder: true, rootDir: 'src' }],

      // 식별자의 최소 길이를 2로 설정
      'id-length': ['warn', { min: 2, exceptions: ['_', 'e'] }],

      // 식별자 대소문자 규칙
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike', // interface, type, class 등
          format: ['PascalCase'],
        },
      ],
    },
  },
);
