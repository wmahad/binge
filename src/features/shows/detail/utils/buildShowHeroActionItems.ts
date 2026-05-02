import type { Show } from "@generated";
import { ExternalLink, Play, Share2 } from "lucide-vue-next";
import type { Component } from "vue";

export type ShowHeroActionItem = {
	id: string;
	label: string;
	variant: "primary" | "outline";
	icon: Component;
	iconClass?: string;
	href?: string;
	external?: boolean;
	nativeType?: "button" | "submit";
	isShare?: boolean;
};

export function buildShowHeroActionItems(show: Show): ShowHeroActionItem[] {
	const href = show.officialSite || undefined;
	const site = Boolean(show.officialSite);
	const list: ShowHeroActionItem[] = [
		{
			id: "watch",
			label: "Watch Now",
			variant: "primary",
			icon: Play,
			iconClass: "fill-current",
			href,
			external: site,
		},
		{
			id: "share",
			label: "Share",
			variant: "outline",
			icon: Share2,
			nativeType: "button",
			isShare: true,
		},
	];
	if (site && href) {
		list.push({
			id: "official",
			label: "Official Site",
			variant: "outline",
			icon: ExternalLink,
			href,
			external: true,
		});
	}
	return list;
}
