import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import { findSimilarByGenre } from "../findSimilarByGenre";

function show(id: number, genres: string[], rating: number | null): Show {
	return {
		id,
		name: `Show ${id}`,
		genres,
		rating: { average: rating ?? undefined },
	} as Show;
}

describe("findSimilarByGenre", () => {
	it("excludes the target show and requires genre overlap", () => {
		const target = show(1, ["Drama"], 8);
		const pool = [
			target,
			show(2, ["Drama", "Comedy"], 7),
			show(3, ["Comedy"], 9),
			show(4, ["Drama"], 7.5),
		];
		const out = findSimilarByGenre(pool, target, 10);
		expect(out.map((show) => show.id)).toEqual([4, 2]);
	});

	it("breaks ties by rating desc when overlap is equal", () => {
		const target = show(1, ["X"], 5);
		const pool = [show(2, ["X"], 9), show(3, ["X"], 8)];
		const out = findSimilarByGenre(pool, target, 5);
		expect(out.map((show) => show.id)).toEqual([2, 3]);
	});
});
