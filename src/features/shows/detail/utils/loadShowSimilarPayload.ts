import type {
	CastMember,
	GetPersonCastcreditsQueryParams,
	Show,
} from "@generated";
import { getPersonCastcredits, getShowCast, getShows } from "@generated";
import { compareShowsByRatingDesc, isNullish } from "@src/utils";

const TOP_CAST_COUNT = 5;
const MIN_CAST_MATCHES_FOR_CAST_ONLY = 4;
const MAX_SIMILAR_RESULTS = 12;
const EMBED_SHOW: GetPersonCastcreditsQueryParams = { embed: "show" };

export type ShowSimilarPayload = {
	cast: CastMember[];
	similar: Show[];
};

function genreOverlapCount(candidate: Show, targetGenres: Set<string>) {
	return candidate.genres.filter((genre) => targetGenres.has(genre)).length;
}

function rankShowsByOverlap(
	shows: Show[],
	overlapFor: (show: Show) => number,
): Show[] {
	return shows
		.map((show) => ({ show, overlap: overlapFor(show) }))
		.filter((row) => row.overlap > 0)
		.sort((first, second) => {
			if (second.overlap !== first.overlap)
				return second.overlap - first.overlap;
			return compareShowsByRatingDesc(first.show, second.show);
		})
		.map((row) => row.show);
}

function mergeWithGenreFallback(
	castOverlapResults: Show[],
	catalogPool: Show[],
	target: Show,
): Show[] {
	const targetGenres = new Set(target.genres);
	const seenIds = new Set(castOverlapResults.map((item) => item.id));
	const fallbackCandidates = catalogPool.filter(
		(candidate) => candidate.id !== target.id && !seenIds.has(candidate.id),
	);
	const genreFallbackResults = rankShowsByOverlap(
		fallbackCandidates,
		(candidate) => genreOverlapCount(candidate, targetGenres),
	);

	return [...castOverlapResults, ...genreFallbackResults].slice(
		0,
		MAX_SIMILAR_RESULTS,
	);
}

async function collectCastOverlapSimilarShows(
	showId: number,
	cast: CastMember[],
): Promise<Show[]> {
	const overlapCounts = new Map<number, { show: Show; count: number }>();

	for (const member of cast) {
		try {
			const credits = await getPersonCastcredits(member.person.id, EMBED_SHOW);
			for (const credit of credits) {
				const candidate = credit._embedded?.show;
				if (isNullish(candidate) || candidate.id === showId) continue;
				const entry = overlapCounts.get(candidate.id);
				if (entry) entry.count++;
				else overlapCounts.set(candidate.id, { show: candidate, count: 1 });
			}
		} catch {
			// Ignore per-person failures; keep partial overlap results from remaining cast.
		}
	}

	return Array.from(overlapCounts.values())
		.sort((first, second) => {
			if (second.count !== first.count) return second.count - first.count;
			return compareShowsByRatingDesc(first.show, second.show);
		})
		.slice(0, MAX_SIMILAR_RESULTS)
		.map((aggregate) => aggregate.show);
}

/**
 * Cast rail + “similar” grid: cast overlap first; if thin, pad from genre overlap in catalog page 0.
 */
export async function loadShowSimilarPayload(
	show: Show,
): Promise<ShowSimilarPayload> {
	const cast = ((await getShowCast(show.id)) ?? []).slice(0, TOP_CAST_COUNT);
	const castOverlapResults = await collectCastOverlapSimilarShows(
		show.id,
		cast,
	);
	if (castOverlapResults.length >= MIN_CAST_MATCHES_FOR_CAST_ONLY) {
		return { cast, similar: castOverlapResults };
	}
	const catalogPool = await getShows({ page: 0 });
	const mergedResults = mergeWithGenreFallback(
		castOverlapResults,
		catalogPool,
		show,
	);
	return { cast, similar: mergedResults };
}
