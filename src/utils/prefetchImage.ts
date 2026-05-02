const prefetchedUrls = new Set<string>();

export function prefetchImageUrl(url: string | null | undefined): void {
	if (!url || prefetchedUrls.has(url)) return;
	prefetchedUrls.add(url);
	const img = new Image();
	img.decoding = "async";
	img.src = url;
}
