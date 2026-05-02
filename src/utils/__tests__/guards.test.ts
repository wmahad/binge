import { describe, expect, it } from "vitest";
import { isNullish, isUndefined } from "../guards";

describe("isUndefined", () => {
	it.each([
		[undefined, true],
		[null, false],
		[0, false],
		["", false],
		[false, false],
		[Number.NaN, false],
		[{}, false],
	] as const)("isUndefined(%p) === %s", (value, expected) => {
		expect(isUndefined(value)).toBe(expected);
	});
});

describe("isNullish", () => {
	it.each([
		[null, true],
		[undefined, true],
		[0, false],
		["", false],
		[false, false],
	] as const)("isNullish(%p) === %s", (value, expected) => {
		expect(isNullish(value)).toBe(expected);
	});
});
