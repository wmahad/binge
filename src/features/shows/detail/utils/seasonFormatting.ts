import type { Season } from "@generated";

/** Section title / hero fact line: “N seasons · M episodes”. */
export function formatSeasonsKicker(
	seasonCount: number,
	totalEpisodes: number,
): string {
	const noun = seasonCount === 1 ? "season" : "seasons";
	const episodesPart = totalEpisodes > 0 ? ` · ${totalEpisodes} episodes` : "";
	return `${seasonCount} ${noun}${episodesPart}`;
}

export function formatSeasonEpisodeLabel(
	season: Pick<Season, "episodeOrder">,
): string {
	return season.episodeOrder
		? `${season.episodeOrder} episodes`
		: "Episodes TBA";
}

export function formatSeasonAirYearRange(
	season: Pick<Season, "premiereDate" | "endDate">,
): string | null {
	const { premiereDate, endDate } = season;
	if (!premiereDate) return null;
	const startYear = premiereDate.slice(0, 4);
	const endYear = endDate?.slice(0, 4);
	if (!endYear || endYear === startYear) return startYear;
	return `${startYear} – ${endYear}`;
}

export function totalEpisodesFromSeasons(
	seasons: readonly Pick<Season, "episodeOrder">[],
): number {
	return seasons.reduce(
		(total, season) => total + (season.episodeOrder ?? 0),
		0,
	);
}
