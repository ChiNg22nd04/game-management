import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
	{
		ignores: [
			"node_modules/**",
			"dist/**",
			".nuxt/**",
			"*.log",
			".env",
			".history/**",
			"server/**",
			"test_*.js"
		],
	},
	js.configs.recommended,
	...vue.configs["flat/recommended"],
	{
		files: ["**/*.js"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				defineNuxtConfig: "readonly",
				$fetch: "readonly",
				defineOptions: "readonly",
				console: "readonly",
				process: "readonly"
			}
		},
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "error"
		}
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			globals: {
				...globals.browser,
				...globals.node,
				defineNuxtConfig: "readonly",
				$fetch: "readonly",
				defineOptions: "readonly",
				console: "readonly",
				process: "readonly"
			}
		},
		plugins: {
			"@typescript-eslint": tseslint
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": ["warn", { 
				"argsIgnorePattern": "^_", 
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}],
			"no-undef": "error"
		}
	},
	{
		files: ["**/*.vue"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				defineNuxtConfig: "readonly",
				$fetch: "readonly",
				defineOptions: "readonly",
				console: "readonly",
				process: "readonly"
			}
		},
		rules: {
			"vue/multi-word-component-names": "off",
			"vue/require-default-prop": "off",
			"no-unused-vars": "off",
			"no-undef": "error"
		}
	}
]; 