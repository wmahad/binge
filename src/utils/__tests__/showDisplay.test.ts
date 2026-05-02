import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import { buildShowDisplayMeta, showPosterSrc } from "../showDisplay";

function minimalShow(overrides: Partial<Show> = {}): Show {
	return {
		id: 1,
		name: "Test Show",
		genres: ["Drama", "Thriller"],
		summary: "<p>Short <b>plot</b></p>",
		rating: { average: 8.2 },
		image: {
			medium: "https://static.test/m.jpg",
			original: "https://static.test/o.jpg",
		},
		...overrides,
	} as Show;
}

describe("showPosterSrc", () => {
	it("prefers medium when present", () => {
		expect(showPosterSrc(minimalShow())).toBe("https://static.test/m.jpg");
	});

	it("falls back to original when medium is absent", () => {
		expect(
			showPosterSrc({
				image: { original: "https://static.test/o.jpg" },
			} as Pick<Show, "image">),
		).toBe("https://static.test/o.jpg");
	});

	it("returns null when there is no image object", () => {
		expect(showPosterSrc({ image: undefined } as Pick<Show, "image">)).toBe(
			null,
		);
	});
});

describe("buildShowDisplayMeta", () => {
	it("builds rating label, genre chip string, and optional stripped summary", () => {
		const meta = buildShowDisplayMeta(minimalShow(), {
			genreLimit: 1,
			includeSummary: true,
		});
		expect(meta.ratingAverageLabel).toBe("8.2");
		expect(meta.hasRatingAverage).toBe(true);
		expect(meta.genresLabel).toBe("Drama");
		expect(meta.plainSummary).toBe("Short plot");
	});

	it("joins all genres when genreLimit is omitted", () => {
		const meta = buildShowDisplayMeta(minimalShow());
		expect(meta.genresLabel).toBe("Drama • Thriller");
	});

	it("treats genreLimit 0 as unset (falsy), so all genres are joined", () => {
		const meta = buildShowDisplayMeta(minimalShow(), { genreLimit: 0 });
		expect(meta.genresLabel).toBe("Drama • Thriller");
	});

	it("omits summary text when includeSummary is false", () => {
		const meta = buildShowDisplayMeta(minimalShow(), { includeSummary: false });
		expect(meta.plainSummary).toBe("");
	});

	it("marks no rating when average is absent", () => {
		const meta = buildShowDisplayMeta(
			minimalShow({ rating: { average: undefined } }),
		);
		expect(meta.hasRatingAverage).toBe(false);
		expect(meta.ratingAverageLabel).toBe("");
	});
});
