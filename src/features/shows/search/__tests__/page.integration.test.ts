import App from "@src/app/App.vue";
import { createImage, createShow } from "@src/generated/mocks/faker";
import { searchShowsHandler } from "@src/generated/msw/msw";
import {
	createIntegrationRouter,
	distinctDisplayName,
	renderWithAppProviders,
	searchHit,
	stubSearchShows,
} from "@src/test/integration";
import { mswWorker } from "@src/test/msw-worker";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";
import SearchPage from "../page.vue";

const BLANK_HOME = defineComponent({
	name: "IntegrationBlankHome",
	template: "<div />",
});

describe("Search integration (App shell + MSW)", () => {
	it("renders the empty state when there is no query", async () => {
		mswWorker.use(stubSearchShows(() => []));

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		await renderWithAppProviders(App, { router, initialLocation: "/search" });

		expect(
			screen.getByRole("heading", { level: 1, name: "Search" }),
		).toBeInTheDocument();
		expect(
			screen.getByText("Type a show name in the bar above."),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "Find your next binge" }),
		).toBeInTheDocument();
	});

	it("renders result cards and the count when the search API returns hits", async () => {
		const show = createShow({
			id: 44_001,
			name: distinctDisplayName(71_001),
			genres: ["Drama"],
			summary: "<p>Alpha hit summary.</p>",
			rating: { average: 8.4 },
			image: createImage({ medium: "https://example.invalid/search-hit.jpg" }),
		});
		mswWorker.use(
			stubSearchShows((query) => (query === "Alpha" ? [searchHit(show)] : [])),
		);

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/search?q=Alpha",
		});

		await screen.findByText("1 shows found");
		expect(
			screen.getByRole("heading", {
				level: 1,
				name: /Results for.*Alpha/i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: new RegExp(show.name) }),
		).toHaveAttribute("href", `/shows/${show.id}`);
	});

	it("shows the no-results empty state when the search API returns an empty list", async () => {
		mswWorker.use(stubSearchShows(() => []));

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/search?q=NothingHere",
		});

		await screen.findByRole("heading", { name: "No matches found" });
		expect(screen.getAllByText(/NothingHere/i).length).toBeGreaterThan(0);
	});

	it("runs a query from a suggestion chip", async () => {
		const show = createShow({
			id: 44_002,
			name: "Breaking Bad",
			genres: ["Drama"],
			summary: "<p>Meth drama.</p>",
			rating: { average: 9.5 },
			image: createImage({ medium: "https://example.invalid/bb.jpg" }),
		});
		mswWorker.use(
			stubSearchShows((query) =>
				query === "Breaking Bad" ? [searchHit(show)] : [],
			),
		);

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/search",
		});

		await userEvent.click(screen.getByRole("button", { name: "Breaking Bad" }));

		await screen.findByText("1 shows found");
		expect(appRouter.currentRoute.value.path).toBe("/search");
		expect(appRouter.currentRoute.value.query.q).toBe("Breaking Bad");
		expect(screen.getByRole("link", { name: /Breaking Bad/i })).toHaveAttribute(
			"href",
			`/shows/${show.id}`,
		);
	});

	it("shows the results skeleton until the search request resolves", async () => {
		const show = createShow({
			id: 44_003,
			name: distinctDisplayName(71_003),
			genres: ["Thriller"],
			summary: "<p>Delayed.</p>",
			rating: { average: 7 },
			image: createImage({ medium: "https://example.invalid/delay.jpg" }),
		});
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = () => resolve();
		});

		mswWorker.use(
			searchShowsHandler(async ({ request }) => {
				const query = new URL(request.url).searchParams.get("q") ?? "";
				if (query !== "Slow") return HttpResponse.json([]);
				await gate;
				return HttpResponse.json([searchHit(show)]);
			}),
		);

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/search?q=Slow",
		});

		expect(
			document.querySelector(".ui-skeleton-search-result-poster"),
		).toBeInTheDocument();

		release();

		await screen.findByText("1 shows found");
		expect(
			document.querySelector(".ui-skeleton-search-result-poster"),
		).not.toBeInTheDocument();
	});

	it("navigates home via Browse trending", async () => {
		mswWorker.use(stubSearchShows(() => []));

		const router = createIntegrationRouter(BLANK_HOME, {
			searchPage: SearchPage,
		});
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/search?q=NothingHere",
		});

		await screen.findByRole("heading", { name: "No matches found" });

		await userEvent.click(
			screen.getByRole("link", { name: /Browse trending shows/i }),
		);

		expect(appRouter.currentRoute.value.path).toBe("/");
	});
});
