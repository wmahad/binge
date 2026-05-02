import { getShows, getShowsQueryKey } from "@generated";
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";

export type ShowsCatalogQueriesOptions = {
	retry?: boolean | number;
};

/**
 * Fetch multiple catalog pages (same endpoint) and merge results for genre grids,
 * dashboard hero carousel, etc.
 */
export function useShowsCatalogQueries(
	pages: number[],
	options?: ShowsCatalogQueriesOptions,
) {
	const results = useQueries({
		queries: pages.map((page) => ({
			queryKey: getShowsQueryKey({ page }),
			queryFn: () => getShows({ page }),
			...(options?.retry !== undefined ? { retry: options.retry } : {}),
		})),
	});

	const loading = computed(() =>
		results.value.some((result) => result.isPending),
	);

	const mergedShows = computed(() =>
		results.value.flatMap((result) => result.data ?? []),
	);

	const firstError = computed(
		() => results.value.find((result) => result.isError)?.error ?? null,
	);

	function refetchAll() {
		for (const result of results.value) void result.refetch();
	}

	return {
		results,
		loading,
		mergedShows,
		firstError,
		refetchAll,
	};
}
