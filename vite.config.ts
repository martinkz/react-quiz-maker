/// <reference types="vitest" />

import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		dts({
			include: ["src/Quiz"],
			insertTypesEntry: true,
		}),
	],
	build: {
		copyPublicDir: false,
		lib: {
			entry: resolve(__dirname, "src/Quiz/index.ts"),
			name: "react-quiz-maker",
			fileName: "react-quiz-maker",
			formats: ["es", "umd"],
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
				},
			},
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
	},
});
