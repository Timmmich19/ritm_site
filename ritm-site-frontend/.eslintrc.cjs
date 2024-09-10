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
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "airbnb",
    "airbnb/hooks",
    "prettier",
    "plugin:prettier/recommended",
    "next/core-web-vitals", // Конфигурация для Next.js
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "react/react-in-jsx-scope": "off", // Не нужен импорт React в Next.js
    "react/require-default-props": "off", // Отключение требования для defaultProps
    "react-hooks/exhaustive-deps": "warn", // Рекомендуемое правило для зависимостей хуков
    "linebreak-style": "off", // Отключение проверки стиля переноса строк
    "no-unused-vars": "off", // Отключение стандартного правила
    "@typescript-eslint/no-unused-vars": ["error"], // Включение TS-анализа неиспользуемых переменных
    "no-console": "off", // Разрешить консольные выводы
    "no-shadow": "off", // Отключение стандартного правила для shadowing
    "@typescript-eslint/no-shadow": ["error"], // Включение правила для shadowing в TypeScript
  },
  settings: {
    react: {
      version: "detect", // Автоматическое определение версии React
    },
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json", // Путь до вашего tsconfig
      },
    },
  },
};
