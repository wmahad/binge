import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginFaker } from "@kubb/plugin-faker";
import { pluginMsw } from "@kubb/plugin-msw";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginVueQuery } from "@kubb/plugin-vue-query";

const TVMAZE_BASE = "https://api.tvmaze.com";

export default defineConfig({
	root: ".",
	input: {
		path: "./openapi/tvmaze.yaml",
	},
	output: {
		path: "./src/generated",
		clean: true,
		/** Biome excludes `./src/generated`; formatting would no-op or fail the hook. */
		format: false,
		lint: false,
	},
	hooks: {
		done: "node ./scripts/cleanup-generated-artifacts.mjs",
	},
	plugins: [
		pluginOas(),
		pluginTs({
			/** Single-file mode: path must look like a file (`.ts`). */
			output: { path: "types/generated.ts", barrelType: "named" },
		}),
		pluginFaker({
			output: { path: "mocks/faker.ts", barrelType: "named" },
			seed: [12_345],
		}),
		pluginClient({
			output: { path: "clients", barrelType: "named" },
			client: "fetch",
			baseURL: TVMAZE_BASE,
			group: { type: "tag" },
		}),
		pluginVueQuery({
			output: { path: "hooks", barrelType: "named" },
			group: { type: "tag" },
			client: {
				client: "fetch",
				baseURL: TVMAZE_BASE,
			},
		}),
		pluginMsw({
			output: { path: "msw/msw.ts", barrelType: "named" },
			handlers: true,
			baseURL: TVMAZE_BASE,
			parser: "faker",
		}),
	],
});
