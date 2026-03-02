import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Combined and updated global ignores (ESLint 9 replaces .eslintignore)
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
    "node_modules/**",
    "dist/**",
    "public/**",
    "reference/**",
  ]),
  {
    files: ["scripts/**/*.{js,ts,cjs}", "*.{js,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    // Explicitly add 'react-hooks' plugin to this configuration object to resolve prefix lookup.
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/set-state-in-effect": "off", // Disable strict synchronous state setting check; standard hydration pattern.
    },
  },
  // Must be last to override other configs
  prettierConfig,
]);

export default eslintConfig;
