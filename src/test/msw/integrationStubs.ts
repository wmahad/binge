import { faker } from "@faker-js/faker";
import type {
	CastMember,
	CrewMember,
	SearchShowResult,
	Season,
	Show,
} from "@generated";
import {
	getPersonCastcreditsHandler,
	getShowByIdHandler,
	getShowCastHandler,
	getShowCrewHandler,
	getShowSeasonsHandler,
	getShowsHandler,
	searchShowsHandler,
} from "@src/generated/msw/msw";
import { HttpResponse } from "msw";

export function distinctDisplayName(salt: number): string {
	faker.seed(salt);
	return faker.company.name();
}

export function catalogByPage(page0: Show[], page1: Show[] = []) {
	return getShowsHandler(({ request }) => {
		const page = new URL(request.url).searchParams.get("page") ?? "0";
		if (page === "0") return HttpResponse.json(page0);
		if (page === "1") return HttpResponse.json(page1);
		return HttpResponse.json([]);
	});
}

export function catalogByPages(pages: Partial<Record<0 | 1 | 2 | 3, Show[]>>) {
	const pick = (p: 0 | 1 | 2 | 3) => pages[p] ?? [];
	return getShowsHandler(({ request }) => {
		const raw = new URL(request.url).searchParams.get("page") ?? "0";
		const page = Number(raw);
		const map: Show[][] = [pick(0), pick(1), pick(2), pick(3)];
		return HttpResponse.json(map[page] ?? []);
	});
}

export function searchHit(show: Show, score = 1): SearchShowResult {
	return { score, show };
}

export function stubSearchShows(
	resolve: (query: string) => SearchShowResult[],
) {
	return searchShowsHandler(({ request }) => {
		const query = new URL(request.url).searchParams.get("q") ?? "";
		return HttpResponse.json(resolve(query));
	});
}

export function isRequestedShow(
	params: { id?: string | readonly string[] },
	showId: string,
): boolean {
	return String(params.id) === showId;
}

export function mswSeasonCastCrewEmpty() {
	return [
		getShowSeasonsHandler(() => HttpResponse.json([])),
		getShowCastHandler(() => HttpResponse.json([])),
		getShowCrewHandler(() => HttpResponse.json([])),
	];
}

export function showByIdWhenOnly(show: Show) {
	const id = String(show.id);
	return getShowByIdHandler(({ params }) =>
		isRequestedShow(params, id)
			? HttpResponse.json(show)
			: HttpResponse.json(null, { status: 404 }),
	);
}

export function mswHandlersSimilarCardNav(mainShow: Show, similarTarget: Show) {
	return [
		getShowByIdHandler(({ params }) => {
			const id = String(params.id);
			if (id === String(mainShow.id)) return HttpResponse.json(mainShow);
			if (id === String(similarTarget.id))
				return HttpResponse.json(similarTarget);
			return HttpResponse.json(null, { status: 404 });
		}),
		...mswSeasonCastCrewEmpty(),
		getShowsHandler(({ request }) => {
			const page = new URL(request.url).searchParams.get("page") ?? "0";
			return HttpResponse.json(page === "0" ? [similarTarget] : []);
		}),
		getPersonCastcreditsHandler(() => HttpResponse.json([])),
	];
}

export function tvmazeDetailHandlers(options: {
	mainShow: Show;
	seasons?: Season[];
	cast?: CastMember[];
	crew?: CrewMember[];
	catalogPage0?: Show[];
}) {
	const {
		mainShow,
		seasons = [],
		cast = [],
		crew = [],
		catalogPage0 = [],
	} = options;
	const id = String(mainShow.id);

	return [
		showByIdWhenOnly(mainShow),
		getShowSeasonsHandler(({ params }) =>
			HttpResponse.json(isRequestedShow(params, id) ? seasons : []),
		),
		getShowCastHandler(({ params }) =>
			HttpResponse.json(isRequestedShow(params, id) ? cast : []),
		),
		getShowCrewHandler(({ params }) =>
			HttpResponse.json(isRequestedShow(params, id) ? crew : []),
		),
		getShowsHandler(({ request }) => {
			const page = new URL(request.url).searchParams.get("page") ?? "0";
			return HttpResponse.json(page === "0" ? catalogPage0 : []);
		}),
		getPersonCastcreditsHandler(() => HttpResponse.json([])),
	];
}
