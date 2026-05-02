import type { Show } from "@generated";
import { TARGET_GENRES } from "@src/config";
import { describe, expect, it } from "vitest";
import { groupShowsByGenre } from "../groupShowsByGenre";

function makeShow(id: number, genres: string[], rating: number): Show {
	return {
		id,
		name: `S${id}`,
		genres,
		rating: { average: rating },
	} as Show;
}

describe("groupShowsByGenre", () => {
	it("places each show in every matching target-genre bucket", () => {
		const buckets = groupShowsByGenre([
			makeShow(1, ["Drama", "Comedy"], 9),
			makeShow(2, ["Drama"], 8),
		]);
		expect(buckets.get("Drama")?.map((show) => show.id)).toEqual([1, 2]);
		expect(buckets.get("Comedy")?.map((show) => show.id)).toEqual([1]);
	});

	it("ignores genres outside TARGET_GENRES", () => {
		const buckets = groupShowsByGenre([makeShow(1, ["UnknownGenre"], 10)]);
		for (const genreLabel of TARGET_GENRES) {
			expect(buckets.get(genreLabel)?.length ?? 0).toBe(0);
		}
	});

	it("sorts each bucket by rating descending", () => {
		const buckets = groupShowsByGenre([
			makeShow(1, ["Drama"], 7),
			makeShow(2, ["Drama"], 9),
		]);
		expect(buckets.get("Drama")?.map((show) => show.id)).toEqual([2, 1]);
	});
});
