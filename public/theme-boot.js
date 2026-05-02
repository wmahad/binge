try {
	const STORAGE_KEY = "binge-theme";
	const stored = localStorage.getItem(STORAGE_KEY);
	const mode = stored === "light" || stored === "dark" ? stored : "light";
	const { documentElement } = document;
	documentElement.classList.toggle("light", mode === "light");
	documentElement.style.colorScheme = mode;
} catch {
	/* localStorage / matchMedia unavailable */
}
