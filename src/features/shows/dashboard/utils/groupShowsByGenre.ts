import type { Show } from "@generated";

import { TARGET_GENRES } from "@src/config";
import { compareShowsByRatingDesc } from "@src/utils";

export function groupShowsByGenre(shows: Show[]): Map<string, Show[]> {
	const buckets = new Map<string, Show[]>(
		TARGET_GENRES.map((genre) => [genre, []]),
	);

	for (const show of shows) {
		for (const genre of show.genres) {
			const list = buckets.get(genre);
			if (list) list.push(show);
		}
	}

	for (const list of buckets.values()) {
		list.sort(compareShowsByRatingDesc);
	}

	return buckets;
}
