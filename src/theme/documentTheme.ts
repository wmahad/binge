/** Keep in sync with `public/theme-boot.js` (blocking head script — avoids theme FOUC). */
export const THEME_STORAGE_KEY = "binge-theme";

export type ThemeMode = "dark" | "light";

export function readStoredThemeMode(): ThemeMode {
	if (typeof window === "undefined") return "light";

	try {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
		return "light";
	} catch {
		return "light";
	}
}

export function applyDocumentTheme(mode: ThemeMode): void {
	const root = document.documentElement;
	root.classList.toggle("light", mode === "light");
	root.style.colorScheme = mode;
}
