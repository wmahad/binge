<script setup lang="ts">
import { isNullish } from "@src/utils";
import { computed } from "vue";
import type { AppHeadingVariant } from "./types";

type HeadingTag = "h1" | "h2" | "h3";

const TAG_BY_LEVEL: Record<1 | 2 | 3, HeadingTag> = {
	1: "h1",
	2: "h2",
	3: "h3",
};

const TAG_BY_VARIANT: Record<AppHeadingVariant, HeadingTag> = {
	hero: "h1",
	heroFeature: "h1",
	section: "h2",
	subsection: "h3",
	genreHero: "h1",
	searchHero: "h1",
	rowTitle: "h2",
	cardTitle: "h3",
	posterTitle: "h3",
	emptyStateTitle: "h2",
};

const VARIANT_CLASSES: Record<AppHeadingVariant, string> = {
	hero: "ui-heading-hero",
	heroFeature: "ui-heading-hero-feature",
	section: "ui-heading-section-base md:text-3xl",
	subsection: "ui-heading-subsection",
	genreHero: "ui-heading-genre-hero",
	searchHero: "ui-heading-search-hero",
	rowTitle: "ui-heading-row-title",
	cardTitle: "ui-heading-card-title",
	posterTitle: "ui-heading-poster-title",
	emptyStateTitle: "ui-heading-section-base",
};

const props = defineProps<{
	level?: 1 | 2 | 3;
	variant: AppHeadingVariant;
}>();

const tag = computed(() =>
	!isNullish(props.level)
		? TAG_BY_LEVEL[props.level]
		: TAG_BY_VARIANT[props.variant],
);

const variantClass = computed(() => VARIANT_CLASSES[props.variant]);
</script>

<template>
	<component :is="tag" :class="variantClass">
		<slot />
	</component>
</template>
