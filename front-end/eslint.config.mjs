import { defineConfig } from "eslint/config"
import globals from "globals"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"

// Configuration de compatibilité pour utiliser les extensions recommandées
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    // On étend la configuration recommandée, y compris celle de Next.js
    extends: compat.extends(
      "eslint:recommended",
      "prettier",
      "next",
      "plugin:react/recommended",
    ),
    languageOptions: {
      globals: {
        ...globals.node,
      },
      // Passage en ECMAScript 2021 pour supporter import/export et JSX
      ecmaVersion: 2021,
      sourceType: "module",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    // Ajout explicite du plugin "next" dans la section plugins
    plugins: {
      next: {}, // Indique que le plugin Next.js est utilisé
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      indent: "off",
      "linebreak-style": ["error", "unix"],
      quotes: [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: true },
      ],
      semi: ["error", "never"],
      "no-console": "error",
      "no-implicit-globals": "error",
      "no-warning-comments": ["error", { terms: ["fixme", "todo"] }],
      "newline-before-return": "error",
      curly: "error",
      "padded-blocks": ["error", "never"],
      "space-before-blocks": "error",
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: [
            "break",
            "case",
            "cjs-export",
            "class",
            "continue",
            "do",
            "if",
            "switch",
            "try",
            "while",
            "return",
          ],
        },
        {
          blankLine: "always",
          prev: [
            "break",
            "case",
            "cjs-export",
            "class",
            "continue",
            "do",
            "if",
            "switch",
            "try",
            "while",
            "return",
          ],
          next: "*",
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
    },
    files: ["**/*.{js,jsx}"],
  },
])
