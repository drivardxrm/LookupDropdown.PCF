const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const storybook = require("eslint-plugin-storybook");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "obj/**",
      "out/**",
      "storybook-static/**",
      ".teach/**",
      // MDX was never linted before (no MDX parser configured, no "lint" npm
      // script exists in this project) - excluded explicitly so a manual
      // `eslint stories` invocation doesn't fail on a pre-existing gap.
      "**/*.mdx",
    ],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tsParser,
      parserOptions: {
        ...react.configs.flat.recommended.languageOptions.parserOptions,
        ecmaVersion: 12,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ComponentFramework: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  ...storybook.configs["flat/recommended"],
];
