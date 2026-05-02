import type { CastMember, Show } from "@generated";
import { getShows } from "@generated";
import { findSimilarByGenre } from "./findSimilarByGenre";
import { fetchSimilarByCast } from "./similarByCast";

const MIN_CAST_OVERLAP_RESULTS = 4;
const SIMILAR_ROW_CAP = 12;

export type ShowSimilarPayload = {
	cast: CastMember[];
	similar: Show[];
};

/**
 * Cast rail + “similar” grid: cast overlap first; if thin, pad from genre overlap in catalog page 0.
 */
export async function loadShowSimilarPayload(
	show: Show,
	preloadedCast?: CastMember[],
): Promise<ShowSimilarPayload> {
	const { shared, cast } = await fetchSimilarByCast(show.id, 5, preloadedCast);
	if (shared.length >= MIN_CAST_OVERLAP_RESULTS) {
		return { cast, similar: shared };
	}
	const pool = await getShows({ page: 0 });
	const seenIds = new Set(shared.map((item) => item.id));
	const merged = [
		...shared,
		...findSimilarByGenre(pool, show).filter(
			(candidate) => !seenIds.has(candidate.id),
		),
	].slice(0, SIMILAR_ROW_CAP);
	return { cast, similar: merged };
}
