import type { Show } from "@generated";
import { compareShowsByRatingDesc } from "@src/utils";

export function findSimilarByGenre(
	all: Show[],
	target: Show,
	limit = 12,
): Show[] {
	const targetGenres = new Set(target.genres);
	return all
		.filter((other) => other.id !== target.id)
		.map((other) => ({
			show: other,
			overlap: other.genres.filter((genre) => targetGenres.has(genre)).length,
		}))
		.filter((row) => row.overlap > 0)
		.sort((left, right) => {
			if (right.overlap !== left.overlap) return right.overlap - left.overlap;
			return compareShowsByRatingDesc(left.show, right.show);
		})
		.slice(0, limit)
		.map((row) => row.show);
}
