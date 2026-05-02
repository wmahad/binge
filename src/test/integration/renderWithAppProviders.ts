import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";
import type { RenderOptions } from "@testing-library/vue";
import { render, screen } from "@testing-library/vue";
import {
	createMemoryHistory,
	createRouter,
	type RouteRecordRaw,
	type Router,
} from "vue-router";

export function createTestQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
				/** Browser Vitest / Playwright toggles focus between runs; avoid post-teardown refetches. */
				refetchOnWindowFocus: false,
				refetchOnReconnect: false,
			},
			mutations: { retry: false },
		},
	});
}

const PLACEHOLDER_ROUTES: RouteRecordRaw[] = [
	{ path: "/", component: { template: "<div />" } },
	{ path: "/genres/:genre", component: { template: "<div />" } },
	{ path: "/shows/:id", component: { template: "<div />" } },
	{ path: "/search", component: { template: "<div />" } },
];

export function createPlaceholderMemoryRouter(
	extraRoutes: RouteRecordRaw[] = [],
): Router {
	return createRouter({
		history: createMemoryHistory(),
		routes: [...PLACEHOLDER_ROUTES, ...extraRoutes],
	});
}

export type RenderWithAppProvidersOptions<C> = RenderOptions<C> & {
	queryClient?: QueryClient;
	router?: Router;
	initialLocation?: string;
	routeOverrides?: RouteRecordRaw[];
};

export async function renderWithAppProviders<C>(
	ui: C,
	options: RenderWithAppProvidersOptions<C> = {},
) {
	const {
		queryClient: queryClientOpt,
		router: routerOpt,
		initialLocation = "/",
		routeOverrides = [],
		...renderOptions
	} = options;

	const queryClient = queryClientOpt ?? createTestQueryClient();
	const router = routerOpt ?? createPlaceholderMemoryRouter(routeOverrides);

	await router.push(initialLocation);
	await router.isReady();

	const existingGlobal = renderOptions.global ?? {};
	const existingPlugins = existingGlobal.plugins ?? [];

	const result = render(ui, {
		...renderOptions,
		global: {
			...existingGlobal,
			plugins: [router, [VueQueryPlugin, { queryClient }], ...existingPlugins],
		},
	});

	return { ...result, queryClient, router };
}

export function findViewAllForGenre(genre: string) {
	return screen
		.getAllByRole("link", { name: /View all/i })
		.find((link) =>
			link.getAttribute("href")?.includes(encodeURIComponent(genre)),
		);
}
