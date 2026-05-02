import { describe, expect, it } from "vitest";
import { initialsFromName, joinWithMiddleDot, stripHtml } from "../string";

describe("stripHtml", () => {
	it("returns empty for nullish input", () => {
		expect(stripHtml(null)).toBe("");
		expect(stripHtml(undefined)).toBe("");
		expect(stripHtml("")).toBe("");
	});

	it("strips tags (including nested) and trims outer whitespace", () => {
		expect(stripHtml("  <p>Hello</p>  ")).toBe("Hello");
		expect(stripHtml("<div><span>x</span></div>")).toBe("x");
		expect(stripHtml("<article><p>a</p><footer>b</footer></article>")).toBe(
			"ab",
		);
	});

	it("strips any <…> sequence (including text that looks like comparison)", () => {
		// Implementation is tag-naive: `<` … `>` is removed as one segment.
		expect(stripHtml("3 < 4 and 5 > 2")).toBe("3  2");
	});
});

describe("joinWithMiddleDot", () => {
	it("joins non-empty parts with middle dot", () => {
		expect(joinWithMiddleDot(["Sci‑Fi", "Drama"])).toContain("•");
		expect(joinWithMiddleDot(["a", "b"])).toBe("a • b");
	});

	it("returns empty string for empty input", () => {
		expect(joinWithMiddleDot([])).toBe("");
	});
});

describe("initialsFromName", () => {
	it("collects first grapheme of each word up to maxLetters", () => {
		expect(initialsFromName("Ada Lovelace")).toBe("AL");
		expect(initialsFromName("Ada Lovelace", 1)).toBe("A");
		expect(initialsFromName("  Jane   Doe  ")).toBe("JD");
	});

	it("respects maxLetters when multiple words exist", () => {
		expect(initialsFromName("Mary Jane Watson")).toBe("MJ");
		expect(initialsFromName("Mary Jane Watson", 3)).toBe("MJW");
	});

	it("single-word name yields one initial before slice", () => {
		expect(initialsFromName("Prince")).toBe("P");
		expect(initialsFromName("Prince", 1)).toBe("P");
	});

	it("returns empty when there are no word tokens", () => {
		expect(initialsFromName("   ")).toBe("");
		expect(initialsFromName("\t\n")).toBe("");
	});
});
