import { defineConfig, mergeConfig } from "vite";
import { viteShared } from "./vite.shared";

export default mergeConfig(
	viteShared(),
	defineConfig({
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (!id.includes("node_modules")) return;
						if (id.includes("lucide-vue-next")) return "lucide";
						if (id.includes("@tanstack")) return "tanstack";
						if (id.includes("vue-router")) return "vue-router";
						if (id.includes("@vue/") || id.includes("/vue/dist/")) {
							return "vue";
						}
					},
				},
			},
		},
	}),
);
