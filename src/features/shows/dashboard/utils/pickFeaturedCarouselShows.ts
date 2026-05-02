import type { Show } from "@generated";
import { compareShowsByRatingDesc } from "@src/utils";

const DEFAULT_MIN_RATING = 8.5;
const DEFAULT_LIMIT = 8;

/** High-rated shows with hero imagery — dashboard carousel pool. */
export function pickFeaturedCarouselShows(
	shows: readonly Show[],
	options?: { minRating?: number; limit?: number },
): Show[] {
	const minRating = options?.minRating ?? DEFAULT_MIN_RATING;
	const limit = options?.limit ?? DEFAULT_LIMIT;
	return [...shows]
		.filter(
			(show) => show.image?.original && (show.rating.average ?? 0) >= minRating,
		)
		.sort(compareShowsByRatingDesc)
		.slice(0, limit);
}
