import { describe, expect, it } from "vitest";
import { buildPagerModelEntries } from "../buildPagerModelEntries";

describe("buildPagerModelEntries", () => {
	it("inserts ellipsis when gap between neighbors exceeds 1", () => {
		expect(buildPagerModelEntries([1, 2, 10])).toEqual([
			{ kind: "page", pageNumber: 1 },
			{ kind: "page", pageNumber: 2 },
			{ kind: "ellipsis", id: "gap-before-10" },
			{ kind: "page", pageNumber: 10 },
		]);
	});

	it("does not ellipsis adjacent pages", () => {
		expect(buildPagerModelEntries([1, 2, 3])).toEqual([
			{ kind: "page", pageNumber: 1 },
			{ kind: "page", pageNumber: 2 },
			{ kind: "page", pageNumber: 3 },
		]);
	});
});
