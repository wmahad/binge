export function stripHtml(html: string | null | undefined): string {
	if (!html) return "";
	return html.replace(/<[^>]*>/g, "").trim();
}

export function joinWithMiddleDot(parts: readonly string[]): string {
	return parts.join(" • ");
}

/** First letters of words, for avatar fallbacks (e.g. "Ada Lovelace" -> "AL"). */
export function initialsFromName(fullName: string, maxLetters = 2): string {
	return fullName
		.split(/\s+/)
		.filter(Boolean)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("")
		.slice(0, maxLetters);
}
