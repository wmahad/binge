import type { Show } from "@generated";
import App from "@src/app/App.vue";
import { createImage, createShow } from "@src/generated/mocks/faker";
import { getShowsHandler } from "@src/generated/msw/msw";
import {
	catalogByPages,
	createIntegrationRouter,
	distinctDisplayName,
	renderWithAppProviders,
} from "@src/test/integration";
import { mswWorker } from "@src/test/msw-worker";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { defineComponent } from "vue";
import GenrePage from "../page.vue";

const BLANK_HOME = defineComponent({
	name: "IntegrationBlankHome",
	template: "<div />",
});

function dramaPair(): { dramaA: Show; dramaB: Show } {
	const dramaA = createShow({
		id: 55_001,
		name: distinctDisplayName(61_001),
		genres: ["Drama"],
		rating: { average: 8.5 },
		image: createImage({ medium: "https://example.invalid/drama-a.jpg" }),
	});
	const dramaB = createShow({
		id: 55_002,
		name: distinctDisplayName(61_002),
		genres: ["Drama"],
		rating: { average: 7.9 },
		image: createImage({ medium: "https://example.invalid/drama-b.jpg" }),
	});
	return { dramaA, dramaB };
}

function manyDramaShows(count: number): Show[] {
	return Array.from({ length: count }, (_, index) =>
		createShow({
			id: 90_000 + index,
			name: `Paged Drama ${String(index).padStart(3, "0")}`,
			genres: ["Drama"],
			rating: { average: 8 - index * 0.01 },
			image: createImage({
				medium: `https://example.invalid/drama-page-${index}.jpg`,
			}),
		}),
	);
}

describe("Genre hub integration (App shell + MSW catalog)", () => {
	it("renders the genre hero, show count, and poster grid when the catalog matches", async () => {
		const { dramaA, dramaB } = dramaPair();
		mswWorker.use(catalogByPages({ 0: [dramaA, dramaB] }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		await screen.findByText("2 shows");
		expect(
			screen.getByRole("heading", { level: 1, name: "Drama" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: new RegExp(dramaA.name) }),
		).toHaveAttribute("href", `/shows/${dramaA.id}`);
		expect(
			screen.getByRole("link", { name: new RegExp(dramaB.name) }),
		).toHaveAttribute("href", `/shows/${dramaB.id}`);
	});

	it("shows an empty state when no catalog shows include the genre", async () => {
		const nonMatch = createShow({
			id: 66_001,
			name: distinctDisplayName(62_001),
			genres: ["Comedy"],
			rating: { average: 7 },
			image: createImage({ medium: "https://example.invalid/c.jpg" }),
		});
		mswWorker.use(catalogByPages({ 0: [nonMatch] }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		expect(
			await screen.findByText(/No shows found for Drama/i),
		).toBeInTheDocument();
	});

	it("updates sort via chip links (query + page reset)", async () => {
		const { dramaA, dramaB } = dramaPair();
		mswWorker.use(catalogByPages({ 0: [dramaA, dramaB] }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		await screen.findByText("2 shows");

		await userEvent.click(screen.getByRole("link", { name: "A → Z" }));

		expect(appRouter.currentRoute.value.path).toBe("/genres/Drama");
		expect(appRouter.currentRoute.value.query.sort).toBe("name");
		expect(appRouter.currentRoute.value.query.page).toBe("1");
	});

	it("shows pagination when the filtered list exceeds the page size", async () => {
		const shows = manyDramaShows(25);
		mswWorker.use(catalogByPages({ 0: shows }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		await screen.findByText("25 shows");

		const next = screen.getByRole("link", { name: "Next" });
		expect(next).toBeInTheDocument();
		await userEvent.click(next);

		expect(appRouter.currentRoute.value.query.page).toBe("2");
		await screen.findByRole("link", { name: /Paged Drama 024/ });

		await userEvent.click(screen.getByRole("link", { name: "Prev" }));
		expect(appRouter.currentRoute.value.query.page).toBe("1");
	});

	it("decodes the genre slug for the page heading (hyphenated TVMaze label)", async () => {
		const sciFi = createShow({
			id: 71_010,
			name: distinctDisplayName(71_010),
			genres: ["Science-Fiction"],
			rating: { average: 8 },
			image: createImage({ medium: "https://example.invalid/sf.jpg" }),
		});
		mswWorker.use(catalogByPages({ 0: [sciFi] }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Science-Fiction",
		});

		await screen.findByText("1 shows");
		expect(
			screen.getByRole("heading", { level: 1, name: "Science-Fiction" }),
		).toBeInTheDocument();
	});

	it("shows the grid skeleton until catalog pages resolve", async () => {
		const { dramaA } = dramaPair();
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = () => resolve();
		});

		mswWorker.use(
			getShowsHandler(async ({ request }) => {
				const page = new URL(request.url).searchParams.get("page") ?? "0";
				if (page !== "0") return HttpResponse.json([]);
				await gate;
				return HttpResponse.json([dramaA]);
			}),
		);

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		expect(
			document.querySelector(".ui-skeleton-genre-grid-poster"),
		).toBeInTheDocument();

		release();

		await screen.findByText("1 shows");
		expect(
			document.querySelector(".ui-skeleton-genre-grid-poster"),
		).not.toBeInTheDocument();
	});

	it("navigates to search from the header while on a genre page", async () => {
		const { dramaA } = dramaPair();
		mswWorker.use(catalogByPages({ 0: [dramaA] }));

		const router = createIntegrationRouter(BLANK_HOME, {
			genrePage: GenrePage,
		});
		const { router: appRouter } = await renderWithAppProviders(App, {
			router,
			initialLocation: "/genres/Drama",
		});

		await screen.findByText("1 shows");

		const term = "Wire";
		await userEvent.type(screen.getByLabelText("Search TV shows"), term);
		await userEvent.keyboard("{Enter}");

		expect(
			await screen.findByRole("status", { name: `Search query ${term}` }),
		).toHaveTextContent(`q=${term}`);
		expect(appRouter.currentRoute.value.path).toBe("/search");
		expect(appRouter.currentRoute.value.query.q).toBe(term);
	});
});
