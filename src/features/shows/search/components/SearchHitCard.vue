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
}>();

const displayMeta = computed(() =>
	buildShowDisplayMeta(props.show, { genreLimit: 3, includeSummary: true }),
);

const showName = computed(() => props.show.name);

const posterSrc = computed(() => showPosterSrc(props.show));

function prefetchPoster() {
	prefetchImageUrl(posterSrc.value);
}
</script>

<template>
	<RouterLink
		:to="`/shows/${show.id}`"
		class="group ui-media-card-shadow ui-media-card-list"
		@pointerenter="prefetchPoster"
	>
		<AppMediaFrame variant="listPoster">
			<MediaCoverImage
				v-if="posterSrc"
				:src="posterSrc"
				:alt="showName"
				layout="block"
				sizes="96px"
				class="ui-media-image-hover group-hover:scale-[1.03]"
			/>
			<div
				v-else
				class="ui-media-fallback p-2"
			>
				{{ showName }}
			</div>
		</AppMediaFrame>
		<div class="ui-search-hit-content">
			<AppHeading
				variant="cardTitle"
				:level="3"
				class="mb-1 line-clamp-1"
			>
				{{ showName }}
			</AppHeading>
			<div class="ui-meta-row">
				<span
					v-if="displayMeta.hasRatingAverage"
					class="ui-search-hit-rating"
				>
					<Star class="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
					{{ displayMeta.ratingAverageLabel }}
				</span>
				<span class="line-clamp-1">{{ displayMeta.genresLabel }}</span>
			</div>
			<AppText variant="mutedXs" class="line-clamp-3">
				{{ displayMeta.plainSummary }}
			</AppText>
		</div>
	</RouterLink>
</template>
