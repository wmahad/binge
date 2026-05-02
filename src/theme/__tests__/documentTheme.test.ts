import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	applyDocumentTheme,
	readStoredThemeMode,
	THEME_STORAGE_KEY,
} from "../documentTheme";

describe("readStoredThemeMode", () => {
	beforeEach(() => {
		localStorage.removeItem(THEME_STORAGE_KEY);
	});

	afterEach(() => {
		localStorage.removeItem(THEME_STORAGE_KEY);
	});

	it('returns "light" when nothing is stored', () => {
		expect(readStoredThemeMode()).toBe("light");
	});

	it('returns stored "dark" or "light"', () => {
		localStorage.setItem(THEME_STORAGE_KEY, "dark");
		expect(readStoredThemeMode()).toBe("dark");
		localStorage.setItem(THEME_STORAGE_KEY, "light");
		expect(readStoredThemeMode()).toBe("light");
	});

	it('falls back to "light" for invalid stored values', () => {
		localStorage.setItem(THEME_STORAGE_KEY, "sepia");
		expect(readStoredThemeMode()).toBe("light");
	});

	it('falls back to "light" when localStorage throws', () => {
		const spy = vi
			.spyOn(Storage.prototype, "getItem")
			.mockImplementation(() => {
				throw new Error("blocked");
			});
		expect(readStoredThemeMode()).toBe("light");
		spy.mockRestore();
	});
});

describe("applyDocumentTheme", () => {
	const root = document.documentElement;

	beforeEach(() => {
		root.classList.remove("light");
		root.style.removeProperty("color-scheme");
	});

	afterEach(() => {
		root.classList.remove("light");
		root.style.removeProperty("color-scheme");
	});

	it('sets light class and color-scheme for "light"', () => {
		applyDocumentTheme("light");
		expect(root.classList.contains("light")).toBe(true);
		expect(root.style.colorScheme).toBe("light");
	});

	it('removes light class and sets dark color-scheme for "dark"', () => {
		root.classList.add("light");
		applyDocumentTheme("dark");
		expect(root.classList.contains("light")).toBe(false);
		expect(root.style.colorScheme).toBe("dark");
	});
});
