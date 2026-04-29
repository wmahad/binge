import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [vue(), tailwindcss()],
	resolve: {
		alias: {
			"@src": fileURLToPath(new URL("./src", import.meta.url)),
			"@pages": fileURLToPath(
				new URL("./src/features/shows/pages", import.meta.url),
			),
		},
	},
});
