import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import { pickFeaturedCarouselShows } from "../pickFeaturedCarouselShows";

function show(id: number, rating: number, image?: { original?: string }): Show {
	return {
		id,
		name: `S${id}`,
		genres: [],
		rating: { average: rating },
		image,
	} as Show;
}

describe("pickFeaturedCarouselShows", () => {
	it("requires original hero image and min rating", () => {
		const pool = [
			show(1, 9, { original: "https://img/o.jpg" }),
			show(2, 9, {}),
			show(3, 8, { original: "https://img/x.jpg" }),
		];
		const picked = pickFeaturedCarouselShows(pool, {
			minRating: 8.5,
			limit: 5,
		});
		expect(picked.map((show) => show.id)).toEqual([1]);
	});

	it("sorts by rating and respects limit", () => {
		const pool = [
			show(1, 9.5, { original: "a" }),
			show(2, 10, { original: "b" }),
			show(3, 9, { original: "c" }),
		];
		const picked = pickFeaturedCarouselShows(pool, {
			minRating: 8,
			limit: 2,
		});
		expect(picked.map((show) => show.id)).toEqual([2, 1]);
	});
});
