import {
	applyDocumentTheme,
	readStoredThemeMode,
	THEME_STORAGE_KEY,
	type ThemeMode,
} from "@src/theme";
import { computed, ref, watch } from "vue";

export type { ThemeMode };

function normalizeThemeMode(raw: string | null | undefined): ThemeMode {
	return raw === "dark" || raw === "light" ? raw : "light";
}

const stored = ref<string>(
	typeof window !== "undefined" ? readStoredThemeMode() : "light",
);

watch(
	stored,
	(raw) => {
		const next = normalizeThemeMode(raw);
		if (next !== raw) {
			stored.value = next;
			return;
		}
		localStorage.setItem(THEME_STORAGE_KEY, next);
		applyDocumentTheme(next);
	},
	{ immediate: true },
);

if (typeof window !== "undefined") {
	window.addEventListener("storage", (event: StorageEvent) => {
		if (event.key !== THEME_STORAGE_KEY || event.newValue == null) return;
		const next = normalizeThemeMode(event.newValue);
		if (next !== stored.value) stored.value = next;
	});
}

const theme = computed<ThemeMode>({
	get() {
		return normalizeThemeMode(stored.value);
	},
	set(next: ThemeMode) {
		stored.value = next;
	},
});

export function useTheme() {
	function toggleTheme() {
		theme.value = theme.value === "dark" ? "light" : "dark";
	}

	return { theme, toggleTheme };
}
