import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
// Lấy cấu hình flat cho vue và typescript-eslint
const vueRecommended = vue.configs["flat/recommended"];
const tsRecommended = tseslint.flatConfigs["flat/recommended"];

export default [
	{
		ignores: ["node_modules/**", "dist/**", ".nuxt/**", "*.log", ".env"],
	},
	js,
	// Cấu hình cho Vue
	...vueRecommended,
	// Cấu hình cho TypeScript
	...tsRecommended,
];
