import { describe, expect, it } from "vitest";
import { errorMessageFromUnknown } from "../errorMessage";

describe("errorMessageFromUnknown", () => {
	it("returns .message for Error and Error subclasses", () => {
		expect(errorMessageFromUnknown(new Error("boom"), "fallback")).toBe("boom");
		expect(errorMessageFromUnknown(new TypeError("bad type"), "x")).toBe(
			"bad type",
		);
	});

	it("returns fallback for primitives and plain objects", () => {
		expect(errorMessageFromUnknown("string err", "fallback")).toBe("fallback");
		expect(errorMessageFromUnknown(null, "fallback")).toBe("fallback");
		expect(errorMessageFromUnknown({ code: 1 }, "fallback")).toBe("fallback");
		expect(errorMessageFromUnknown(undefined, "none")).toBe("none");
	});
});
