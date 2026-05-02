import type { Show } from "@generated";
import {
	type CastMember,
	type GetPersonCastcreditsQueryParams,
	getPersonCastcredits,
	getShowCast,
} from "@generated";
import { isNullish } from "@src/utils";

const EMBED_SHOW: GetPersonCastcreditsQueryParams = { embed: "show" };

async function showsForPerson(personId: number): Promise<Show[]> {
	try {
		const credits = await getPersonCastcredits(personId, EMBED_SHOW);
		return credits
			.map((credit) => credit._embedded?.show)
			.filter((embedded): embedded is Show => !isNullish(embedded));
	} catch {
		return [];
	}
}

async function castForShow(showId: number | string): Promise<CastMember[]> {
	try {
		const castMembers = await getShowCast(Number(showId));
		return castMembers ?? [];
	} catch {
		return [];
	}
}

/** Shows that share top-billed cast with this show (uses generated TVMaze clients). */
export async function fetchSimilarByCast(
	showId: number | string,
	topN = 5,
	preloadedCast?: CastMember[],
): Promise<{ shared: Show[]; cast: CastMember[] }> {
	const cast = preloadedCast ?? (await castForShow(showId));
	const top = cast.slice(0, topN);
	const lists = await Promise.all(
		top.map((member) => showsForPerson(member.person.id)),
	);

	const counts = new Map<number, { show: Show; count: number }>();
	for (const showsFromCast of lists) {
		for (const candidate of showsFromCast) {
			if (String(candidate.id) === String(showId)) continue;
			const entry = counts.get(candidate.id);
			if (entry) entry.count++;
			else counts.set(candidate.id, { show: candidate, count: 1 });
		}
	}

	const shared = Array.from(counts.values())
		.sort((first, second) => {
			if (second.count !== first.count) return second.count - first.count;
			return (
				(second.show.rating.average ?? 0) - (first.show.rating.average ?? 0)
			);
		})
		.slice(0, 12)
		.map((aggregate) => aggregate.show);

	return { shared, cast: top };
}
