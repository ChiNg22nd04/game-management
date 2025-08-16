import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import tsParser from "@typescript-eslint/parser";
import tseslint from "@typescript-eslint/eslint-plugin";

const vueRecommended = vue.configs["flat/recommended"];

export default [
	{
		ignores: ["node_modules/**", "dist/**", ".nuxt/**", "*.log", ".env"],
	},
	js.configs["recommended"],
	...vueRecommended,
	{
		files: ["*.ts", "*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint
		},
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn"
		}
	}
];
