import type { CastMember, Show } from "@generated";
import {
	loadShowSimilarPayload,
	type ShowSimilarPayload,
} from "@src/features/shows/detail/utils/loadShowSimilarPayload";
import { isUndefined } from "@src/utils";
import { useQuery } from "@tanstack/vue-query";
import type { ComputedRef, Ref } from "vue";
import { computed } from "vue";

function emptySimilarPayload(): ShowSimilarPayload {
	return { cast: [], similar: [] };
}

/** Cast + similar shows derived after main show payload is loaded (matches stable show id). */
export function useShowSimilarContent(
	routeShowId: ComputedRef<number | undefined>,
	detailShowRef: Ref<Show | undefined>,
	preloadedCastRef?: Ref<CastMember[] | undefined>,
) {
	const enabled = computed(() => {
		const resolvedId = routeShowId.value;
		const loadedShow = detailShowRef.value;
		const hasPreloadedCast = isUndefined(preloadedCastRef)
			? true
			: !isUndefined(preloadedCastRef.value);
		return (
			!isUndefined(resolvedId) &&
			!isUndefined(loadedShow) &&
			loadedShow.id === resolvedId &&
			hasPreloadedCast
		);
	});

	return useQuery({
		queryKey: computed(() => ["show-similar", routeShowId.value] as const),
		queryFn: async () => {
			const resolvedId = routeShowId.value;
			const loadedShow = detailShowRef.value;
			if (
				isUndefined(resolvedId) ||
				!loadedShow ||
				loadedShow.id !== resolvedId
			) {
				return emptySimilarPayload();
			}
			return loadShowSimilarPayload(loadedShow, preloadedCastRef?.value);
		},
		enabled,
	});
}
