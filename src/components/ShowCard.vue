<script setup lang="ts">
import type { Show } from "@generated";
import {
	AppHeading,
	AppMediaFrame,
	AppText,
	MediaCoverImage,
} from "@src/components";
import {
	buildShowDisplayMeta,
	prefetchImageUrl,
	showPosterSrc,
} from "@src/utils";
import { Star } from "lucide-vue-next";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
	show: Show;
	fluid?: boolean;
}>();

const displayMeta = computed(() =>
	buildShowDisplayMeta(props.show, { genreLimit: 2 }),
);

const posterSrc = computed(() => showPosterSrc(props.show));

function prefetchPoster() {
	prefetchImageUrl(posterSrc.value);
}
</script>

<template>
	<RouterLink
		:to="`/shows/${show.id}`"
		class="group ui-media-card-shadow ui-media-card-poster"
		@pointerenter="prefetchPoster"
		:class="
			fluid
				? 'w-full'
				: 'ui-poster-rail-item'
		"
	>
		<AppMediaFrame variant="poster" class="ui-show-card-poster-overlay-host">
			<MediaCoverImage
				v-if="posterSrc"
				:src="posterSrc"
				:alt="show.name"
				layout="block"
				sizes="(max-width: 640px) 42vw, (max-width: 1024px) 22vw, 200px"
				class="ui-media-image-hover ui-media-image-hover-poster"
			/>
			<div
				v-else
				class="ui-media-fallback px-2"
			>
				{{ show.name }}
			</div>
			<div
				v-if="displayMeta.hasRatingAverage"
				class="ui-show-card-rating-badge"
			>
				<Star class="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
				{{ displayMeta.ratingAverageLabel }}
			</div>
		</AppMediaFrame>
		<div
			class="ui-show-card-content-reveal"
		>
			<AppHeading
				variant="posterTitle"
				:level="3"
				class="ui-show-card-title mb-0 line-clamp-2"
			>
				{{ show.name }}
			</AppHeading>
			<AppText variant="mutedXs" class="ui-show-card-meta mt-1 hidden line-clamp-1 md:block">
				{{ displayMeta.genresLabel }}
			</AppText>
		</div>
	</RouterLink>
</template>
