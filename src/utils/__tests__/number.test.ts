import { describe, expect, it } from "vitest";
import { formatNumberOrEmpty, parseFiniteNumber } from "../number";

describe("parseFiniteNumber", () => {
	it("parses finite numbers from numbers or numeric strings", () => {
		expect(parseFiniteNumber(42)).toBe(42);
		expect(parseFiniteNumber("3.5")).toBe(3.5);
		expect(parseFiniteNumber("0")).toBe(0);
		expect(parseFiniteNumber("")).toBe(0);
	});

	it("returns undefined for non-finite numeric results", () => {
		expect(parseFiniteNumber(Number.NaN)).toBeUndefined();
		expect(parseFiniteNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
		expect(parseFiniteNumber("x")).toBeUndefined();
	});

	it("returns undefined when Number() throws (e.g. Symbol)", () => {
		expect(parseFiniteNumber(Symbol("x"))).toBeUndefined();
	});
});

describe("formatNumberOrEmpty", () => {
	it("respects fractionDigits for display labels", () => {
		expect(formatNumberOrEmpty(8.25, 1)).toBe("8.3");
		expect(formatNumberOrEmpty(8, 2)).toBe("8.00");
		expect(formatNumberOrEmpty(0, 0)).toBe("0");
	});

	it("returns empty string for nullish so UI can omit the row", () => {
		expect(formatNumberOrEmpty(null)).toBe("");
		expect(formatNumberOrEmpty(undefined)).toBe("");
	});
});
