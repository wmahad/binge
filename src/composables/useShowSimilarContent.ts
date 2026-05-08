import type { Show } from "@generated";
import {
	loadShowSimilarPayload,
	type ShowSimilarPayload,
} from "@src/features/shows/detail/utils/loadShowSimilarPayload";
import { isUndefined } from "@src/utils";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

function emptySimilarPayload(): ShowSimilarPayload {
	return { cast: [], similar: [] };
}

/** Cast + similar shows derived after main show payload is loaded (matches stable show id). */
export function useShowSimilarContent(
	routeShowId: () => number | undefined,
	detailShow: () => Show | undefined,
) {
	function resolveShow() {
		const resolvedId = routeShowId();
		const loadedShow = detailShow();
		return isUndefined(resolvedId) ||
			!loadedShow ||
			loadedShow.id !== resolvedId
			? undefined
			: loadedShow;
	}

	return useQuery({
		queryKey: computed(() => ["show-similar", routeShowId()] as const),
		queryFn: async () => {
			const show = resolveShow();
			if (!show) return emptySimilarPayload();
			return loadShowSimilarPayload(show);
		},
		enabled: computed(() => !!resolveShow()),
	});
}
