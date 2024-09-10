module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb/hooks",
    "prettier",
    "plugin:prettier/recommended",
    "next/core-web-vitals", // Добавляем next.js конфигурацию
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.test.tsx", // Разрешены импорты в тестовых файлах
          "**/jest-setup.ts", // Разрешены импорты в конфигурации для тестов
        ],
      },
    ],
    "react/react-in-jsx-scope": "off", // Не нужен импорт React в Next.js
    "react/require-default-props": "off", // Отключение требования для defaultProps
    "react-hooks/exhaustive-deps": "off", // Отключение правила для зависимостей хуков
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "linebreak-style": "off", // Отключение проверки стиля переноса строк
    "no-unused-vars": "off", // Отключение стандартного правила
    "@typescript-eslint/no-unused-vars": ["error"], // Включение TS-анализа неиспользуемых переменных
    "no-console": "off", // Разрешить консольные выводы
    "no-shadow": "off", // Отключение стандартного правила для shadowing
    "@typescript-eslint/no-shadow": ["error"], // Включение правила для shadowing в TypeScript
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // Путь до вашего tsconfig
      },
    },
  },
};
