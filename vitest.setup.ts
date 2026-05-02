import "@testing-library/jest-dom/vitest";

import "./src/styles/main.css";

import { cleanup } from "@testing-library/vue";
import { afterAll, afterEach, beforeAll } from "vitest";
import { nextTick } from "vue";
import { mswWorker } from "./src/test/msw-worker";

/** Real browser: MSW `setupWorker` (Kubb-generated handlers). See `public/mockServiceWorker.js`. */
beforeAll(async () => {
	await mswWorker.start({
		onUnhandledRequest: "bypass",
		serviceWorker: { url: "/mockServiceWorker.js" },
		quiet: true,
	});
});

afterEach(async () => {
	cleanup();
	await nextTick();
	mswWorker.resetHandlers();
});

afterAll(() => {
	mswWorker.stop();
});
