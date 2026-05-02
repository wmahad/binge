import type { Show } from "@generated";
import { describe, expect, it } from "vitest";
import { buildShowHeroActionItems } from "../buildShowHeroActionItems";

describe("buildShowHeroActionItems", () => {
	it("without officialSite yields watch + share only", () => {
		const items = buildShowHeroActionItems({ officialSite: undefined } as Show);
		expect(items.map((item) => item.id)).toEqual(["watch", "share"]);
		expect(items[0]?.href).toBeUndefined();
	});

	it("with officialSite adds duplicate Primary-style watch href + Official Site", () => {
		const items = buildShowHeroActionItems({
			officialSite: "https://example.com/watch",
		} as Show);
		expect(items.map((item) => item.id)).toEqual([
			"watch",
			"share",
			"official",
		]);
		expect(items[0]?.href).toBe("https://example.com/watch");
		expect(items[2]?.href).toBe("https://example.com/watch");
		expect(items[2]?.external).toBe(true);
	});
});
