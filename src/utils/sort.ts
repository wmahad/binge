import type { Show } from "@generated";

export function compareShowsByRatingDesc(left: Show, right: Show): number {
	return (right.rating.average ?? 0) - (left.rating.average ?? 0);
}
