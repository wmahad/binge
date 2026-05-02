import { afterEach, describe, expect, it, vi } from "vitest";

describe("prefetchImageUrl", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.resetModules();
	});

	it("creates one Image load per distinct URL (dedupes repeated URLs)", async () => {
		const instances: { decoding: string; src: string }[] = [];
		class Img {
			decoding = "";
			src = "";
			constructor() {
				instances.push(this);
			}
		}
		vi.stubGlobal("Image", Img);

		const { prefetchImageUrl } = await import("../prefetchImage");

		prefetchImageUrl("https://example.test/a.jpg");
		prefetchImageUrl("https://example.test/a.jpg");
		prefetchImageUrl("https://example.test/b.jpg");

		expect(instances).toHaveLength(2);
		expect(instances[0]?.decoding).toBe("async");
		expect(instances.map((instance) => instance.src).sort()).toEqual([
			"https://example.test/a.jpg",
			"https://example.test/b.jpg",
		]);
	});

	it("does not construct Image for nullish or empty URL", async () => {
		const ctor = vi.fn();
		vi.stubGlobal("Image", ctor);

		const { prefetchImageUrl } = await import("../prefetchImage");

		prefetchImageUrl(null);
		prefetchImageUrl("");
		prefetchImageUrl(undefined);

		expect(ctor).not.toHaveBeenCalled();
	});
});
