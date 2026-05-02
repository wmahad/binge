import type { Season } from "@generated";
import { describe, expect, it } from "vitest";
import {
	formatSeasonAirYearRange,
	formatSeasonEpisodeLabel,
	formatSeasonsKicker,
	totalEpisodesFromSeasons,
} from "../seasonFormatting";

describe("formatSeasonsKicker", () => {
	it("uses singular season and optional episode count", () => {
		expect(formatSeasonsKicker(1, 10)).toBe("1 season · 10 episodes");
		expect(formatSeasonsKicker(2, 0)).toBe("2 seasons");
	});
});

describe("formatSeasonEpisodeLabel", () => {
	it("shows episode count or TBA", () => {
		expect(
			formatSeasonEpisodeLabel({ episodeOrder: 12 } as Pick<
				Season,
				"episodeOrder"
			>),
		).toBe("12 episodes");
		expect(
			formatSeasonEpisodeLabel({ episodeOrder: undefined } as Pick<
				Season,
				"episodeOrder"
			>),
		).toBe("Episodes TBA");
	});
});

describe("formatSeasonAirYearRange", () => {
	it("returns null without premiere", () => {
		expect(
			formatSeasonAirYearRange({
				premiereDate: undefined,
				endDate: undefined,
			} as Pick<Season, "premiereDate" | "endDate">),
		).toBe(null);
	});

	it("returns single year when same or missing end", () => {
		expect(
			formatSeasonAirYearRange({
				premiereDate: "2015-01-01",
				endDate: undefined,
			} as Pick<Season, "premiereDate" | "endDate">),
		).toBe("2015");
		expect(
			formatSeasonAirYearRange({
				premiereDate: "2015-06-01",
				endDate: "2015-12-01",
			} as Pick<Season, "premiereDate" | "endDate">),
		).toBe("2015");
	});

	it("returns range when years differ", () => {
		expect(
			formatSeasonAirYearRange({
				premiereDate: "2015-01-01",
				endDate: "2018-05-01",
			} as Pick<Season, "premiereDate" | "endDate">),
		).toBe("2015 – 2018");
	});
});

describe("totalEpisodesFromSeasons", () => {
	it("sums episodeOrder, treating missing as 0", () => {
		expect(
			totalEpisodesFromSeasons([
				{ episodeOrder: 10 },
				{ episodeOrder: undefined },
				{ episodeOrder: 3 },
			] as Pick<Season, "episodeOrder">[]),
		).toBe(13);
	});
});
