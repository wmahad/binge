import { playwright } from "@vitest/browser-playwright";
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import { viteShared } from "./vite.shared";

export default mergeConfig(
	viteShared(),
	defineConfig({
		test: {
			browser: {
				enabled: true,
				provider: playwright(),
				instances: [{ browser: "chromium" }],
				viewport: { width: 1440, height: 1080 },
			},
			setupFiles: ["./vitest.setup.ts"],
			include: ["src/**/*.test.ts"],
		},
	}),
);
