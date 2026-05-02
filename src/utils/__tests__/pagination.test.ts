import { describe, expect, it } from "vitest";
import {
	buildNeighborPages,
	clampToRange,
	nextPageNumber,
	parsePositiveNumber,
	prevPageNumber,
	slicePageWindow,
	totalPagesFromLength,
} from "../pagination";

describe("clampToRange", () => {
	it("clamps to inclusive [min, max]", () => {
		expect(clampToRange(5, 1, 10)).toBe(5);
		expect(clampToRange(0, 1, 10)).toBe(1);
		expect(clampToRange(99, 1, 10)).toBe(10);
		expect(clampToRange(3, 3, 3)).toBe(3);
	});
});

describe("parsePositiveNumber", () => {
	it("accepts integers and decimals ≥ 1", () => {
		expect(parsePositiveNumber("3")).toBe(3);
		expect(parsePositiveNumber(12)).toBe(12);
		expect(parsePositiveNumber("2.5")).toBe(2.5);
	});

	it("falls back when value is missing, below 1, or not numeric", () => {
		expect(parsePositiveNumber("0")).toBe(1);
		expect(parsePositiveNumber("-2")).toBe(1);
		expect(parsePositiveNumber("nope", 7)).toBe(7);
		expect(parsePositiveNumber(undefined, 4)).toBe(4);
	});
});

describe("totalPagesFromLength", () => {
	it("always returns at least one page (empty catalog still needs one slot)", () => {
		expect(totalPagesFromLength(0, 10)).toBe(1);
	});

	it("ceil-divides item count by page size", () => {
		expect(totalPagesFromLength(25, 10)).toBe(3);
		expect(totalPagesFromLength(20, 10)).toBe(2);
		expect(totalPagesFromLength(21, 10)).toBe(3);
	});
});

describe("slicePageWindow", () => {
	it("uses 1-based page index", () => {
		const items = ["a", "b", "c", "d", "e"];
		expect(slicePageWindow(items, 1, 2)).toEqual(["a", "b"]);
		expect(slicePageWindow(items, 2, 2)).toEqual(["c", "d"]);
		expect(slicePageWindow(items, 3, 2)).toEqual(["e"]);
	});

	it("returns empty when the window starts past the list", () => {
		expect(slicePageWindow(["a"], 5, 10)).toEqual([]);
	});
});

describe("buildNeighborPages", () => {
	it("always includes first and last page plus neighbors around current", () => {
		expect(buildNeighborPages(10, 5, 2)).toEqual([1, 3, 4, 5, 6, 7, 10]);
	});

	it("dedupes and sorts when range overlaps ends", () => {
		expect(buildNeighborPages(3, 1, 2)).toEqual([1, 2, 3]);
		expect(buildNeighborPages(1, 1, 2)).toEqual([1]);
	});
});

describe("prevPageNumber", () => {
	it("steps down but never below 1", () => {
		expect(prevPageNumber(3)).toBe(2);
		expect(prevPageNumber(1)).toBe(1);
	});
});

describe("nextPageNumber", () => {
	it("steps up but never past totalPages", () => {
		expect(nextPageNumber(2, 5)).toBe(3);
		expect(nextPageNumber(5, 5)).toBe(5);
	});
});
