// @ts-check
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  eslint.configs.recommended,
  ...nextTs,
  globalIgnores(["node_modules/**", "dist/**", "build/**", "coverage/**", "*.config.mjs"]),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.commonjs,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
]);

export default eslintConfig;
