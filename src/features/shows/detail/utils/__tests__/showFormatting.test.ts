import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import {
	ratingToFilledStarCount,
	showHeroOverline,
	showPremiereYearsLabel,
	showSummaryPlain,
} from "../showFormatting";

describe("ratingToFilledStarCount", () => {
	it("maps 0–10 average to 0–5 stars (rounded)", () => {
		expect(ratingToFilledStarCount(10)).toBe(5);
		expect(ratingToFilledStarCount(8.4)).toBe(4);
		expect(ratingToFilledStarCount(0)).toBe(0);
	});

	it("returns 0 when average is nullish", () => {
		expect(ratingToFilledStarCount(null)).toBe(0);
		expect(ratingToFilledStarCount(undefined)).toBe(0);
	});
});

describe("showSummaryPlain", () => {
	it("strips HTML and uses fallback when empty", () => {
		expect(showSummaryPlain("<p>Hi</p>")).toBe("Hi");
		expect(showSummaryPlain(null)).toBe("No summary available.");
		expect(showSummaryPlain("<p></p>", "—")).toBe("—");
	});
});

describe("showHeroOverline", () => {
	it("combines type, network name, or language", () => {
		expect(
			showHeroOverline({
				type: "Scripted",
				network: { name: "HBO" },
				language: "English",
			} as Pick<Show, "type" | "network" | "language">),
		).toBe("Scripted · HBO");

		expect(
			showHeroOverline({
				type: undefined,
				network: undefined,
				language: "French",
			} as Pick<Show, "type" | "network" | "language">),
		).toBe("Series · French");
	});
});

describe("showPremiereYearsLabel", () => {
	it("returns null without premiered", () => {
		expect(
			showPremiereYearsLabel({ premiered: undefined, ended: undefined }),
		).toBe(null);
	});

	it("returns range when ended is set", () => {
		expect(
			showPremiereYearsLabel({
				premiered: "2008-01-01",
				ended: "2013-05-05",
			}),
		).toBe("2008 – 2013");
	});

	it("returns start year only when still airing", () => {
		expect(
			showPremiereYearsLabel({ premiered: "2020-06-01", ended: undefined }),
		).toBe("2020");
	});
});
