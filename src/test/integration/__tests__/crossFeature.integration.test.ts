import App from "@src/app/App.vue";
import {
	createCastMember,
	createCharacterRef,
	createCrewMember,
	createImage,
	createPersonWithImage,
	createSeason,
	createShow,
} from "@src/generated/mocks/faker";
import { searchShowsHandler } from "@src/generated/msw/msw";
import { catalogHeroAndComedy } from "@src/test/fixtures/showCatalog";
import {
	catalogByPages,
	createFullIntegrationRouter,
	distinctDisplayName,
	findViewAllForGenre,
	renderWithAppProviders,
	searchHit,
	tvmazeDetailHandlers,
} from "@src/test/integration";
import { mswWorker } from "@src/test/msw-worker";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("Cross-feature integration (full router + App)", () => {
	it("goes from dashboard → genre hub → home using real pages", async () => {
		const { hero, comedy } = catalogHeroAndComedy();
		mswWorker.use(
			catalogByPages({
				0: [hero, comedy],
				1: [],
				2: [],
				3: [],
			}),
		);

		const router = createFullIntegrationRouter();
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/",
		});

		await screen.findByLabelText("Featured slides");

		const dramaViewAll = findViewAllForGenre("Drama");
		expect(dramaViewAll).toBeDefined();
		if (!(dramaViewAll instanceof HTMLAnchorElement))
			throw new Error("view all");
		await userEvent.click(dramaViewAll);

		await screen.findByText("1 shows");
		expect(
			screen.getByRole("heading", { level: 1, name: "Drama" }),
		).toBeInTheDocument();
		expect(appRouter.currentRoute.value.path).toBe("/genres/Drama");

		await userEvent.click(screen.getByRole("link", { name: "BINGE" }));
		await screen.findByLabelText("Featured slides");
		expect(appRouter.currentRoute.value.path).toBe("/");
	});

	it("goes from dashboard → header search → real search results page", async () => {
		const { hero, comedy } = catalogHeroAndComedy();
		const hitShow = createShow({
			id: 33_003,
			name: distinctDisplayName(83_003),
			genres: ["Drama"],
			summary: "<p>Wire-like.</p>",
			rating: { average: 8.8 },
			image: createImage({ medium: "https://example.invalid/wire-hit.jpg" }),
		});

		mswWorker.use(
			searchShowsHandler(({ request }) => {
				const query = new URL(request.url).searchParams.get("q") ?? "";
				if (query === "Wire") return HttpResponse.json([searchHit(hitShow)]);
				return HttpResponse.json([]);
			}),
			catalogByPages({ 0: [hero, comedy], 1: [], 2: [], 3: [] }),
		);

		const router = createFullIntegrationRouter();
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/",
		});

		await screen.findByLabelText("Featured slides");

		const term = "Wire";
		await userEvent.type(screen.getByLabelText("Search TV shows"), term);
		await userEvent.keyboard("{Enter}");

		await screen.findByText("1 shows found");
		expect(appRouter.currentRoute.value.path).toBe("/search");
		expect(appRouter.currentRoute.value.query.q).toBe(term);
		const hitLink = screen.getByRole("link", {
			name: new RegExp(hitShow.name),
		});
		expect(hitLink).toHaveAttribute("href", `/shows/${String(hitShow.id)}`);
	});

	it("goes from search hit → show detail with real pages", async () => {
		const mainShow = createShow({
			id: 42,
			name: distinctDisplayName(84_001),
			genres: ["Drama"],
			summary: "<p>Omega summary.</p>",
			rating: { average: 8.2 },
			image: createImage({
				medium: "https://example.invalid/omega-medium.jpg",
				original: "https://example.invalid/omega-orig.jpg",
			}),
		});

		mswWorker.use(
			searchShowsHandler(({ request }) => {
				const query = new URL(request.url).searchParams.get("q") ?? "";
				if (query === "Omega") return HttpResponse.json([searchHit(mainShow)]);
				return HttpResponse.json([]);
			}),
			...tvmazeDetailHandlers({
				mainShow,
				seasons: [
					createSeason({
						id: 7001,
						number: 1,
						episodeOrder: 6,
					}),
				],
				cast: [
					createCastMember({
						person: createPersonWithImage({
							id: 91_001,
							name: "Alex Actor",
						}),
						character: createCharacterRef({ name: "Lead" }),
					}),
				],
				crew: [
					createCrewMember({
						type: "Creator",
						person: createPersonWithImage({
							id: 92_001,
							name: "Chris Creator",
						}),
					}),
				],
				catalogPage0: [mainShow],
			}),
		);

		const router = createFullIntegrationRouter();
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/search?q=Omega",
		});

		await screen.findByText("1 shows found");
		await userEvent.click(
			screen.getByRole("link", { name: new RegExp(mainShow.name) }),
		);

		await screen.findByRole("heading", { level: 1, name: mainShow.name });
		expect(appRouter.currentRoute.value.path).toBe(
			`/shows/${String(mainShow.id)}`,
		);
		expect(await screen.findByText("Top Cast")).toBeInTheDocument();
		expect(await screen.findByText("Created By")).toBeInTheDocument();
	});

	it("goes from dashboard carousel CTA → real show detail", async () => {
		const { hero, comedy } = catalogHeroAndComedy();
		mswWorker.use(
			...tvmazeDetailHandlers({
				mainShow: hero,
				catalogPage0: [hero, comedy],
			}),
		);

		const router = createFullIntegrationRouter();
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/",
		});

		await screen.findByLabelText("Featured slides");

		await userEvent.click(screen.getByRole("link", { name: /Watch Trailer/i }));

		await screen.findByRole("heading", { level: 1, name: hero.name });
		expect(appRouter.currentRoute.value.path).toBe(`/shows/${String(hero.id)}`);
	});
});
