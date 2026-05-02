import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import {
	compareShowsByPremiered,
	filterSortShowsByGenre,
	genreSortLabel,
	parseGenreSortKey,
	sortShowsBy,
} from "../sortShows";

function makeShow(
	id: number,
	name: string,
	opts: Partial<Pick<Show, "genres" | "premiered" | "rating">> = {},
): Show {
	return {
		id,
		name,
		genres: opts.genres ?? ["Drama"],
		premiered: opts.premiered,
		rating: opts.rating ?? { average: 7 },
	} as Show;
}

describe("parseGenreSortKey", () => {
	it("accepts known keys and falls back otherwise", () => {
		expect(parseGenreSortKey("rating")).toBe("rating");
		expect(parseGenreSortKey("newest")).toBe("newest");
		expect(parseGenreSortKey("bogus", "name")).toBe("name");
		expect(parseGenreSortKey(123)).toBe("rating");
	});
});

describe("compareShowsByPremiered", () => {
	it("sorts by ISO date string", () => {
		const earlierPremiere = makeShow(1, "earlier", {
			premiered: "2010-01-01",
		});
		const laterPremiere = makeShow(2, "later", { premiered: "2020-01-01" });
		expect(
			compareShowsByPremiered(earlierPremiere, laterPremiere, "asc"),
		).toBeLessThan(0);
		expect(
			compareShowsByPremiered(earlierPremiere, laterPremiere, "desc"),
		).toBeGreaterThan(0);
	});

	it("sends null premiered to end for desc and start for asc", () => {
		const old = makeShow(1, "old", { premiered: "2000-01-01" });
		const none = makeShow(2, "none", { premiered: undefined });
		expect(compareShowsByPremiered(old, none, "desc")).toBeLessThan(0);
	});
});

describe("sortShowsBy", () => {
	it("orders by key", () => {
		const shows = [
			makeShow(1, "B", { rating: { average: 8 } }),
			makeShow(2, "A", { rating: { average: 9 } }),
		];
		expect(sortShowsBy(shows, "rating").map((show) => show.id)).toEqual([2, 1]);
		expect(sortShowsBy(shows, "name").map((show) => show.id)).toEqual([2, 1]);
	});
});

describe("filterSortShowsByGenre", () => {
	it("filters by genre label then sorts", () => {
		const shows = [
			makeShow(1, "drama-lower", {
				genres: ["Drama"],
				rating: { average: 7 },
			}),
			makeShow(2, "comedy-only", {
				genres: ["Comedy"],
				rating: { average: 9 },
			}),
			makeShow(3, "drama-higher", {
				genres: ["Drama"],
				rating: { average: 8 },
			}),
		];
		const out = filterSortShowsByGenre(shows, "Drama", "rating");
		expect(out.map((show) => show.id)).toEqual([3, 1]);
	});
});

describe("genreSortLabel", () => {
	it("returns UI label", () => {
		expect(genreSortLabel("rating")).toBe("Top rated");
		expect(genreSortLabel("name")).toBe("A → Z");
	});
});
