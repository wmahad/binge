import type { Show } from "@generated";

import { isNullish, stripHtml } from "@src/utils";

/** TVMaze average is 0-10; hero uses five stars. */
export function ratingToFilledStarCount(
	average: number | null | undefined,
): number {
	return !isNullish(average) ? Math.round(average / 2) : 0;
}

export function showSummaryPlain(
	summaryHtml: string | null | undefined,
	emptyFallback = "No summary available.",
): string {
	const plain = stripHtml(summaryHtml);
	return plain || emptyFallback;
}

export function showHeroOverline(
	show: Pick<Show, "type" | "network" | "language">,
): string {
	const kind = show.type ?? "Series";
	const outlet = show.network?.name ?? show.language ?? "TV";
	return `${kind} · ${outlet}`;
}

export function showPremiereYearsLabel(
	show: Pick<Show, "premiered" | "ended">,
): string | null {
	if (!show.premiered) return null;
	const startYear = show.premiered.slice(0, 4);
	if (!show.ended) return startYear;
	return `${startYear} – ${show.ended.slice(0, 4)}`;
}
