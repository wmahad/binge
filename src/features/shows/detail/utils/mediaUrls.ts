/** TVMaze-style image: prefer `original`, fall back to `medium`. */
export function preferredImageUrl(
	image: { medium?: string; original?: string } | null | undefined,
): string | null {
	if (!image) return null;
	return image.original ?? image.medium ?? null;
}
