import type { Show } from "@generated";
import App from "@src/app/App.vue";
import { createImage, createShow } from "@src/generated/mocks/faker";
import { getShowsHandler } from "@src/generated/msw/msw";
import { catalogHeroAndComedy } from "@src/test/fixtures/showCatalog";
import {
	catalogByPage,
	createIntegrationRouter,
	distinctDisplayName,
	findViewAllForGenre,
	renderWithAppProviders,
} from "@src/test/integration";
import { mswWorker } from "@src/test/msw-worker";
import { THEME_STORAGE_KEY } from "@src/theme";
import { buildShowDisplayMeta } from "@src/utils";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import DashboardPage from "../page.vue";

/** Must match `ThemeToggle`: current mode → header button accessible name (action to take). */
const THEME_TOGGLE_ACTION: Record<"light" | "dark", string> = {
	light: "Switch to dark mode",
	dark: "Switch to light mode",
};

function readThemeFromToggleButton(): "light" | "dark" {
	return screen.queryByRole("button", { name: THEME_TOGGLE_ACTION.light }) !==
		null
		? "light"
		: "dark";
}

/** Enough Drama posters that the horizontal rail overflows at the integration viewport (1440×900). */
function catalogHeroWithManyDramas(): Show[] {
	const hero = createShow({
		id: 88_001,
		name: distinctDisplayName(77_001),
		genres: ["Drama"],
		rating: { average: 9.2 },
		image: createImage({
			original: "https://example.invalid/hero-original.jpg",
			medium: "https://example.invalid/hero-medium.jpg",
		}),
	});
	const extras = Array.from({ length: 14 }, (_, i) =>
		createShow({
			id: 90_100 + i,
			name: distinctDisplayName(81_000 + i),
			genres: ["Drama"],
			rating: { average: 7.4 },
			image: createImage({
				medium: `https://example.invalid/drama-poster-${i}.jpg`,
				original: `https://example.invalid/drama-poster-${i}-orig.jpg`,
			}),
		}),
	);
	return [hero, ...extras];
}

describe("Dashboard integration (App shell + MSW catalog)", () => {
	describe("when the catalog returns a featured-eligible hero and multiple genres", () => {
		it("renders the shell and dashboard chrome, then navigates to show detail, genre explore, and home via in-app links", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			const heroMeta = buildShowDisplayMeta(hero, { includeSummary: true });
			mswWorker.use(catalogByPage([hero, comedy], []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();

			const { router: appRouter } = await renderWithAppProviders(App, {
				router,
				initialLocation: "/",
			});

			await screen.findByLabelText("Featured slides");

			const brandLink = screen.getByRole("link", { name: "BINGE" });
			expect(brandLink).toBeInTheDocument();
			expect(screen.getByLabelText("Search TV shows")).toBeInTheDocument();

			expect(
				screen.getByRole("heading", { level: 1, name: hero.name }),
			).toBeInTheDocument();
			expect(screen.getAllByText(heroMeta.ratingAverageLabel)).toHaveLength(2);

			const watchTrailer = screen.getByRole("link", { name: /Watch Trailer/i });
			expect(watchTrailer).toHaveAttribute("href", `/shows/${hero.id}`);
			expect(screen.getByRole("link", { name: /More Info/i })).toHaveAttribute(
				"href",
				`/shows/${hero.id}`,
			);

			expect(document.body.textContent).toMatch(/Top rated/i);

			expect(findViewAllForGenre("Drama")).toBeDefined();

			expect(screen.getAllByLabelText("Scroll left").length).toBeGreaterThan(0);
			expect(screen.getAllByLabelText("Scroll right").length).toBeGreaterThan(
				0,
			);

			expect(
				screen.getByRole("heading", { level: 3, name: comedy.name }),
			).toBeInTheDocument();

			await user.click(watchTrailer);
			await screen.findByRole("heading", { name: /Show detail/i });
			expect(appRouter.currentRoute.value.path).toBe(`/shows/${hero.id}`);
			expect(
				screen.getByRole("status", { name: `Show id ${hero.id}` }),
			).toHaveTextContent(`Show id ${hero.id}`);

			await user.click(brandLink);
			await screen.findByLabelText("Featured slides");
			expect(appRouter.currentRoute.value.path).toBe("/");

			const dramaViewAll = findViewAllForGenre("Drama");
			expect(dramaViewAll).toBeDefined();
			if (!(dramaViewAll instanceof HTMLAnchorElement)) {
				throw new Error("expected Drama “View all” link");
			}
			await user.click(dramaViewAll);
			await screen.findByRole("heading", { name: /Genre explore/i });
			expect(appRouter.currentRoute.value.path).toBe("/genres/Drama");
			expect(
				screen.getByRole("status", { name: "Genre Drama" }),
			).toHaveTextContent("Genre Drama");

			await user.click(screen.getByRole("link", { name: "BINGE" }));
			await screen.findByLabelText("Featured slides");
			expect(appRouter.currentRoute.value.path).toBe("/");

			await user.click(screen.getByRole("link", { name: /More Info/i }));
			await screen.findByRole("heading", { name: /Show detail/i });
			expect(appRouter.currentRoute.value.path).toBe(`/shows/${hero.id}`);
		});

		it("navigates from a genre-row poster link to the show detail stub", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			mswWorker.use(catalogByPage([hero, comedy], []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			const { router: appRouter } = await renderWithAppProviders(App, {
				router,
				initialLocation: "/",
			});

			await screen.findByRole("heading", { level: 3, name: comedy.name });

			const comedyPosterLinks = [
				...document.querySelectorAll<HTMLAnchorElement>(
					`a[href="/shows/${comedy.id}"]`,
				),
			].filter((anchor) => getComputedStyle(anchor).pointerEvents !== "none");
			expect(comedyPosterLinks.length).toBeGreaterThan(0);
			await user.click(comedyPosterLinks[0]);

			await screen.findByRole("status", { name: `Show id ${comedy.id}` });
			expect(appRouter.currentRoute.value.path).toBe(`/shows/${comedy.id}`);
		});

		it("switches the featured hero copy when a carousel tab is selected", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			mswWorker.use(catalogByPage([hero, comedy], []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			await renderWithAppProviders(App, { router, initialLocation: "/" });

			await screen.findByLabelText("Featured slides");

			expect(
				screen.getByRole("heading", { level: 1, name: hero.name }),
			).toBeInTheDocument();

			await user.click(screen.getByRole("tab", { name: "Slide 2" }));
			await screen.findByRole("heading", { level: 1, name: comedy.name });
		});

		it("moves the genre rail when scroll controls are activated", async () => {
			mswWorker.use(catalogByPage(catalogHeroWithManyDramas(), []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			await renderWithAppProviders(App, { router, initialLocation: "/" });

			await screen.findByLabelText("Featured slides");

			const rail = document.querySelector(".ui-scroll-rail-posters");
			expect(rail).toBeInstanceOf(HTMLElement);
			const scrollBefore = (rail as HTMLElement).scrollLeft;

			await user.click(screen.getAllByLabelText("Scroll right")[0]);

			await waitFor(() => {
				expect((rail as HTMLElement).scrollLeft).not.toBe(scrollBefore);
			});
		});
	});

	describe("header search", () => {
		it("navigates to the search stub with the typed query when the form is submitted", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			mswWorker.use(catalogByPage([hero, comedy], []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			const { router: appRouter } = await renderWithAppProviders(App, {
				router,
				initialLocation: "/",
			});

			await screen.findByLabelText("Featured slides");

			const term = "Wire";
			await user.type(screen.getByLabelText("Search TV shows"), term);
			await user.keyboard("{Enter}");

			expect(
				await screen.findByRole("status", { name: `Search query ${term}` }),
			).toHaveTextContent(`q=${term}`);
			expect(appRouter.currentRoute.value.path).toBe("/search");
			expect(appRouter.currentRoute.value.query.q).toBe(term);
		});
	});

	describe("catalog load failure", () => {
		it("shows the error panel and renders the dashboard after Try again once the API succeeds", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			let allowCatalog = false;

			mswWorker.use(
				getShowsHandler(({ request }) => {
					const page = new URL(request.url).searchParams.get("page") ?? "0";
					if (!allowCatalog) {
						return HttpResponse.text("upstream failure", { status: 502 });
					}
					if (page === "0") return HttpResponse.json([hero, comedy]);
					if (page === "1") return HttpResponse.json([]);
					return HttpResponse.json([]);
				}),
			);

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			await renderWithAppProviders(App, { router, initialLocation: "/" });

			await screen.findByText(/Could not load the TV catalog/i);
			expect(screen.getByRole("alert")).toBeInTheDocument();

			allowCatalog = true;
			await user.click(screen.getByRole("button", { name: /Try again/i }));

			await screen.findByLabelText("Featured slides");
			expect(screen.queryByRole("alert")).not.toBeInTheDocument();
		});
	});

	describe("theme toggle", () => {
		it("toggles document theme class, color-scheme, storage, and the header button copy", async () => {
			const { hero, comedy } = catalogHeroAndComedy();
			mswWorker.use(catalogByPage([hero, comedy], []));

			const router = createIntegrationRouter(DashboardPage);
			const user = userEvent.setup();
			await renderWithAppProviders(App, { router, initialLocation: "/" });

			await screen.findByLabelText("Featured slides");

			const before = readThemeFromToggleButton();
			await user.click(
				screen.getByRole("button", { name: THEME_TOGGLE_ACTION[before] }),
			);

			const after = before === "light" ? "dark" : "light";
			const root = document.documentElement;

			expect(root.classList.contains("light")).toBe(after === "light");
			expect(root.style.colorScheme).toBe(after);
			expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(after);
			expect(
				screen.getByRole("button", { name: THEME_TOGGLE_ACTION[after] }),
			).toBeInTheDocument();
		});
	});

	describe("when no show qualifies for the featured carousel", () => {
		it("still renders genre rows with top-rated chrome and posters, and omits the featured carousel region", async () => {
			const dramaOnly = createShow({
				id: 88003,
				name: distinctDisplayName(77_003),
				genres: ["Drama"],
				rating: { average: 7 },
				image: { medium: "https://example.invalid/medium-only.jpg" },
			});
			mswWorker.use(catalogByPage([dramaOnly], []));

			const router = createIntegrationRouter(DashboardPage);
			await renderWithAppProviders(App, { router, initialLocation: "/" });

			await screen.findByRole("heading", { level: 3, name: dramaOnly.name });
			expect(
				screen.queryByLabelText("Featured slides"),
			).not.toBeInTheDocument();
			expect(document.body.textContent).toMatch(/Top rated/i);
		});
	});
});
