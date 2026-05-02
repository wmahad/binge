import type { Show } from "@generated";
import { compareShowsByRatingDesc } from "@src/utils";

export const GENRE_SORT_KEYS = ["rating", "name", "newest", "oldest"] as const;
export type GenreSortKey = (typeof GENRE_SORT_KEYS)[number];

export function parseGenreSortKey(
	raw: unknown,
	fallback: GenreSortKey = "rating",
): GenreSortKey {
	const queryValue = typeof raw === "string" ? raw : "";
	if ((GENRE_SORT_KEYS as readonly string[]).includes(queryValue)) {
		return queryValue as GenreSortKey;
	}
	return fallback;
}

export function compareShowsByPremiered(
	left: Show,
	right: Show,
	order: "asc" | "desc",
): number {
	const fallbackPremiere = order === "desc" ? "" : "9999";
	const leftSortValue = left.premiered ?? fallbackPremiere;
	const rightSortValue = right.premiered ?? fallbackPremiere;
	const comparison = leftSortValue.localeCompare(rightSortValue);
	return order === "desc" ? -comparison : comparison;
}

const SHOW_COMPARATORS: Record<GenreSortKey, (a: Show, b: Show) => number> = {
	rating: compareShowsByRatingDesc,
	name: (a, b) => a.name.localeCompare(b.name),
	newest: (a, b) => compareShowsByPremiered(a, b, "desc"),
	oldest: (a, b) => compareShowsByPremiered(a, b, "asc"),
};

const GENRE_SORT_LABELS: Record<GenreSortKey, string> = {
	rating: "Top rated",
	name: "A → Z",
	newest: "Newest",
	oldest: "Oldest",
};

export function sortShowsBy(shows: Show[], sort: GenreSortKey): Show[] {
	const sorted = [...shows];
	sorted.sort(SHOW_COMPARATORS[sort]);
	return sorted;
}

/** Genre hub: filter by decoded slug label, then sort. */
export function filterSortShowsByGenre(
	shows: readonly Show[],
	genreLabel: string,
	sort: GenreSortKey,
): Show[] {
	return sortShowsBy(
		shows.filter((show) => show.genres.includes(genreLabel)),
		sort,
	);
}

export function genreSortLabel(opt: GenreSortKey): string {
	return GENRE_SORT_LABELS[opt];
}
