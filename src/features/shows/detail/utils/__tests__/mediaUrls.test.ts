import { describe, expect, it } from "vitest";
import { preferredImageUrl } from "../mediaUrls";

describe("preferredImageUrl", () => {
	it("prefers original over medium", () => {
		expect(
			preferredImageUrl({
				medium: "https://m.jpg",
				original: "https://o.jpg",
			}),
		).toBe("https://o.jpg");
	});

	it("falls back to medium", () => {
		expect(preferredImageUrl({ medium: "https://m.jpg" })).toBe(
			"https://m.jpg",
		);
	});

	it("returns null when missing or empty image", () => {
		expect(preferredImageUrl(null)).toBe(null);
		expect(preferredImageUrl(undefined)).toBe(null);
		expect(preferredImageUrl({})).toBe(null);
	});
});
