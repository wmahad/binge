import type { CastMember, CrewMember, Show } from "@generated";
import App from "@src/app/App.vue";
import DashboardPage from "@src/features/shows/dashboard/page.vue";
import {
	createCastMember,
	createCharacterRef,
	createCrewMember,
	createImage,
	createPersonWithImage,
	createSeason,
	createShow,
} from "@src/generated/mocks/faker";
import {
	getPersonCastcreditsHandler,
	getShowByIdHandler,
} from "@src/generated/msw/msw";
import { catalogHeroAndComedyShows } from "@src/test/fixtures/showCatalog";
import {
	catalogByPage,
	createIntegrationRouter,
	distinctDisplayName,
	mswHandlersSimilarCardNav,
	mswSeasonCastCrewEmpty,
	renderWithAppProviders,
	showByIdWhenOnly,
	tvmazeDetailHandlers,
} from "@src/test/integration";
import { mswWorker } from "@src/test/msw-worker";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { Component } from "vue";
import { defineComponent } from "vue";
import DetailPage from "../page.vue";

const BLANK_HOME = defineComponent({
	name: "IntegrationBlankHome",
	template: "<div />",
});

const SHOW_ID = 42;
const DETAIL_PATH = `/shows/${SHOW_ID}`;

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detailTestRouter(home: Component = BLANK_HOME) {
	return createIntegrationRouter(home, { detailPage: DetailPage });
}

async function mountDetailPage(options: {
	useMsw: () => void;
	home?: Component;
}) {
	options.useMsw();
	return renderWithAppProviders(App, {
		router: detailTestRouter(options.home),
		initialLocation: DETAIL_PATH,
	});
}

function defaultShow(overrides: Partial<Show> = {}): Show {
	return createShow({
		id: SHOW_ID,
		name: distinctDisplayName(11_001),
		genres: ["Drama"],
		summary: "<p>Test summary for the show.</p>",
		rating: { average: 8.1 },
		status: "Running",
		premiered: "2020-01-01",
		language: "English",
		image: createImage({
			medium: "https://example.invalid/detail-medium.jpg",
			original: "https://example.invalid/detail-original.jpg",
		}),
		...overrides,
	});
}

describe("Show detail integration (App shell + MSW)", () => {
	describe("when the main show and section APIs succeed", () => {
		it("renders the hero, genre chips, and omits optional sections when seasons/cast/crew are empty and there is no similar pool", async () => {
			const mainShow = defaultShow();
			await mountDetailPage({
				useMsw: () => mswWorker.use(...tvmazeDetailHandlers({ mainShow })),
			});

			await screen.findByRole("heading", { level: 1, name: mainShow.name });
			expect(screen.getByText("Drama")).toBeInTheDocument();
			expect(
				screen.getByText(/Test summary for the show/i),
			).toBeInTheDocument();

			expect(
				screen.queryByRole("heading", { name: "Seasons" }),
			).not.toBeInTheDocument();
			expect(screen.queryByText("Top Cast")).not.toBeInTheDocument();
			expect(screen.queryByText("Created By")).not.toBeInTheDocument();
			expect(screen.queryByText("More Like This")).not.toBeInTheDocument();
		});

		it("renders the Seasons block when the API returns seasons", async () => {
			const mainShow = defaultShow();
			const season = createSeason({
				id: 9001,
				number: 1,
				episodeOrder: 8,
			});
			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(
						...tvmazeDetailHandlers({ mainShow, seasons: [season] }),
					),
			});

			await screen.findByRole("heading", { name: "Seasons" });
			expect(screen.getByRole("img", { name: "Season 1" })).toBeInTheDocument();
		});

		it("renders Top Cast when the cast API returns members", async () => {
			const mainShow = defaultShow();
			const actorName = distinctDisplayName(22_001);
			const cast: CastMember[] = [
				createCastMember({
					person: createPersonWithImage({
						id: 55_001,
						name: actorName,
					}),
					character: createCharacterRef({ name: "Lead Role" }),
				}),
			];
			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(...tvmazeDetailHandlers({ mainShow, cast })),
			});

			await screen.findByText("Top Cast");
			expect(screen.getByText(actorName)).toBeInTheDocument();
			expect(screen.getByText("Lead Role")).toBeInTheDocument();
		});

		it("renders Created By when crew includes a Creator", async () => {
			const mainShow = defaultShow();
			const creatorName = distinctDisplayName(33_001);
			const crew: CrewMember[] = [
				createCrewMember({
					type: "Creator",
					person: createPersonWithImage({
						id: 66_001,
						name: creatorName,
					}),
				}),
			];
			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(...tvmazeDetailHandlers({ mainShow, crew })),
			});

			await screen.findByText("Created By");
			expect(screen.getByText(creatorName)).toBeInTheDocument();
			expect(screen.getByText("Creator")).toBeInTheDocument();
		});

		it("shows More Like This from catalog genre overlap when cast overlap is thin", async () => {
			const mainShow = defaultShow();
			const similarName = distinctDisplayName(44_001);
			const poolShow = createShow({
				id: 99_001,
				name: similarName,
				genres: ["Drama"],
				rating: { average: 7.9 },
				image: createImage({
					medium: "https://example.invalid/similar-medium.jpg",
				}),
			});
			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(
						...tvmazeDetailHandlers({
							mainShow,
							catalogPage0: [poolShow],
						}),
					),
			});

			await screen.findByText("More Like This");
			expect(
				screen.getByText(`Shows sharing cast & genres with ${mainShow.name}`),
			).toBeInTheDocument();
			expect(
				screen.getByRole("link", {
					name: new RegExp(escapeRegExp(similarName)),
				}),
			).toHaveAttribute("href", `/shows/${poolShow.id}`);
		});

		it("exposes hero actions including Official Site when officialSite is set", async () => {
			const site = "https://example.invalid/official";
			const mainShow = defaultShow({ officialSite: site });
			await mountDetailPage({
				useMsw: () => mswWorker.use(...tvmazeDetailHandlers({ mainShow })),
			});

			await screen.findByRole("heading", { level: 1, name: mainShow.name });

			const watchNow = screen.getByRole("link", { name: /Watch Now/i });
			expect(watchNow).toHaveAttribute("href", site);

			const official = screen.getByRole("link", { name: /Official Site/i });
			expect(official).toHaveAttribute("href", site);
		});

		it("shows the hero skeleton until the main show request resolves", async () => {
			const mainShow = defaultShow();
			let release!: () => void;
			const gate = new Promise<void>((resolve) => {
				release = () => resolve();
			});

			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(
						getShowByIdHandler(async ({ params }) => {
							if (String(params.id) !== String(SHOW_ID)) {
								return HttpResponse.json(null, { status: 404 });
							}
							await gate;
							return HttpResponse.json(mainShow);
						}),
						...tvmazeDetailHandlers({ mainShow }).slice(1),
					),
			});

			expect(
				document.querySelector(".ui-detail-skeleton-hero-content-column"),
			).toBeInTheDocument();

			release();

			await screen.findByRole("heading", { level: 1, name: mainShow.name });
			expect(
				document.querySelector(".ui-detail-skeleton-hero-content-column"),
			).not.toBeInTheDocument();
		});
	});

	describe("navigation", () => {
		it("returns to home via the brand link", async () => {
			const mainShow = defaultShow();
			const { router: appRouter } = await mountDetailPage({
				home: DashboardPage,
				useMsw: () =>
					mswWorker.use(
						showByIdWhenOnly(mainShow),
						...mswSeasonCastCrewEmpty(),
						catalogByPage(catalogHeroAndComedyShows(), []),
						getPersonCastcreditsHandler(() => HttpResponse.json([])),
					),
			});

			await screen.findByRole("heading", { level: 1, name: mainShow.name });

			await userEvent.click(screen.getByRole("link", { name: "BINGE" }));
			await screen.findByLabelText("Featured slides");
			expect(appRouter.currentRoute.value.path).toBe("/");
		});

		it("navigates to another show when a More Like This card is activated", async () => {
			const mainShow = defaultShow();
			const otherId = 77_002;
			const otherName = distinctDisplayName(55_002);
			const similarTarget = createShow({
				id: otherId,
				name: otherName,
				genres: ["Drama"],
				summary: "<p>Other</p>",
				rating: { average: 7.5 },
				image: createImage({
					medium: "https://example.invalid/other-medium.jpg",
				}),
			});

			const { router: appRouter } = await mountDetailPage({
				useMsw: () =>
					mswWorker.use(...mswHandlersSimilarCardNav(mainShow, similarTarget)),
			});

			const similarLink = await screen.findByRole("link", {
				name: new RegExp(escapeRegExp(otherName)),
			});
			await userEvent.click(similarLink);

			await screen.findByRole("heading", { level: 1, name: otherName });
			expect(appRouter.currentRoute.value.path).toBe(`/shows/${otherId}`);
		});

		it("navigates to search with the query when the header form is submitted", async () => {
			const mainShow = defaultShow();
			const { router: appRouter } = await mountDetailPage({
				useMsw: () => mswWorker.use(...tvmazeDetailHandlers({ mainShow })),
			});

			await screen.findByRole("heading", { level: 1, name: mainShow.name });

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

	describe("when the main show request fails", () => {
		it("surfaces an alert and does not render the hero", async () => {
			await mountDetailPage({
				useMsw: () =>
					mswWorker.use(
						getShowByIdHandler(() =>
							HttpResponse.text("upstream failure", { status: 502 }),
						),
					),
			});

			await screen.findByRole("alert");
			expect(
				screen.queryByRole("heading", { level: 1 }),
			).not.toBeInTheDocument();
		});
	});
});
