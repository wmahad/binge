import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import { compareShowsByRatingDesc } from "../sort";

function showWithRating(average: number | null | undefined): Show {
	return {
		rating: { average: average ?? undefined },
	} as Show;
}

describe("compareShowsByRatingDesc (dashboard / list ordering)", () => {
	it("orders higher TVMaze rating first (descending)", () => {
		const hi = showWithRating(9);
		const lo = showWithRating(7);
		expect(compareShowsByRatingDesc(hi, lo)).toBeLessThan(0);
		expect(compareShowsByRatingDesc(lo, hi)).toBeGreaterThan(0);
	});

	it("treats missing average as 0 so unrated shows sink", () => {
		const unrated = showWithRating(null);
		const rated = showWithRating(5);
		expect(compareShowsByRatingDesc(unrated, rated)).toBeGreaterThan(0);
		expect(compareShowsByRatingDesc(rated, unrated)).toBeLessThan(0);
	});

	it("returns 0 when both averages are equal (stable tie)", () => {
		const firstRated = showWithRating(8);
		const secondRated = showWithRating(8);
		expect(compareShowsByRatingDesc(firstRated, secondRated)).toBe(0);
	});

	it("returns 0 when both lack an average", () => {
		expect(
			compareShowsByRatingDesc(showWithRating(null), showWithRating(undefined)),
		).toBe(0);
	});
});
