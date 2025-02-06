import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",

		globals: true,

		include: ["tests/**/*.ts"],

		coverage: {
			provider: "v8",

			include: ["src/**/*.ts"],

			exclude: ["src/cli/run.ts"],

			thresholds: {
				lines: 100,
				statements: 100,
				branches: 100,
				functions: 100,
			},
		},
	},
});
