import { getShowCast } from "@generated";
import { isUndefined } from "@src/utils";
import { useQuery } from "@tanstack/vue-query";
import type { ComputedRef } from "vue";
import { computed } from "vue";

export function useShowCast(showId: ComputedRef<number | undefined>) {
	return useQuery({
		queryKey: computed(() => ["show-cast", showId.value] as const),
		queryFn: async () => {
			if (isUndefined(showId.value)) return [];
			try {
				return (await getShowCast(showId.value)) ?? [];
			} catch {
				return [];
			}
		},
		enabled: computed(() => !isUndefined(showId.value)),
	});
}
