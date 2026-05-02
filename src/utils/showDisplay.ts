import type { Show } from "@generated";
import { formatNumberOrEmpty } from "./number";
import { joinWithMiddleDot, stripHtml } from "./string";

export function showPosterSrc(show: Pick<Show, "image">): string | null {
	const img = show.image;
	if (!img) return null;
	return img.medium ?? img.original ?? null;
}

type BuildShowDisplayMetaOptions = {
	genreLimit?: number;
	includeSummary?: boolean;
};

type ShowDisplayMeta = {
	ratingAverageLabel: string;
	hasRatingAverage: boolean;
	genresLabel: string;
	plainSummary: string;
};

export function buildShowDisplayMeta(
	show: Show,
	options: BuildShowDisplayMetaOptions = {},
): ShowDisplayMeta {
	const ratingAverageLabel = formatNumberOrEmpty(show.rating?.average, 1);
	const hasRatingAverage = ratingAverageLabel.length > 0;
	const genres = options.genreLimit
		? show.genres.slice(0, options.genreLimit)
		: show.genres;
	const genresLabel = joinWithMiddleDot(genres);
	const plainSummary = options.includeSummary ? stripHtml(show.summary) : "";

	return {
		ratingAverageLabel,
		hasRatingAverage,
		genresLabel,
		plainSummary,
	};
}
