import type { Season, Show } from "@generated";
import { describe, expect, it } from "vitest";
import { buildShowHeroFactRows } from "../buildShowHeroFactRows";

describe("buildShowHeroFactRows", () => {
	it("includes runtime, network, language, premiere when present", () => {
		const show = {
			runtime: 42,
			network: { name: "AMC" },
			language: "English",
			premiered: "2008-01-27",
		} as Show;

		const rows = buildShowHeroFactRows(show, [], 0);
		const byId = Object.fromEntries(rows.map((row) => [row.id, row.text]));

		expect(byId.runtime).toBe("42 min episodes");
		expect(byId.network).toBe("AMC");
		expect(byId.language).toBe("English");
		expect(byId.premiered).toBe("Since 2008");
	});

	it("adds seasons row when seasons exist", () => {
		const show = {} as Show;
		const seasons = [{ episodeOrder: 8 }] as Season[];
		const rows = buildShowHeroFactRows(show, seasons, 8);
		const seasonsRow = rows.find((row) => row.id === "seasons");
		expect(seasonsRow?.text).toBe("1 season · 8 episodes");
	});

	it("drops rows whose resolver returns null/empty", () => {
		const show = {
			runtime: undefined,
			network: undefined,
			language: undefined,
			premiered: undefined,
		} as Show;
		expect(buildShowHeroFactRows(show, [], 0)).toEqual([]);
	});
});
