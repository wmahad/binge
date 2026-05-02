import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import type { UserConfig } from "vite";

/** Plugins + aliases shared by `vite.config.ts` and `vitest.config.ts` (Tailwind / `@theme`, `@src`, etc.). */
export function viteShared(): UserConfig {
	return {
		plugins: [vue(), tailwindcss()],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				"@src": fileURLToPath(new URL("./src", import.meta.url)),
				"@generated": fileURLToPath(
					new URL("./src/generated/index.ts", import.meta.url),
				),
			},
		},
	};
}
