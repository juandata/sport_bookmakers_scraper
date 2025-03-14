// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ["**/*.{js,ts}"],
    rules: {
      // Add your custom rules here. For example:
      "no-unused-vars": "warn",
      "no-console": "warn",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      // ... other rules
    },
  },
];
