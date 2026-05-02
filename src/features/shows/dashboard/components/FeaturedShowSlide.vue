<script setup lang="ts">
import type { Show } from "@generated";
import {
	AppHeading,
	AppText,
	MediaCoverImage,
	PillLink,
} from "@src/components";
import { buildShowDisplayMeta } from "@src/utils";
import { Info, Play, Star } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps<{
	show: Show;
	isCurrentSlide: boolean;
}>();

const heroBackdropSrc = computed(() => props.show.image?.original ?? null);
const displayMeta = computed(() =>
	buildShowDisplayMeta(props.show, { includeSummary: true }),
);
const hasMetaRow = computed(
	() =>
		displayMeta.value.hasRatingAverage || displayMeta.value.genresLabel.length > 0,
);
const showDetailPath = computed(() => `/shows/${props.show.id}`);
</script>

<template>
	<div
		class="ui-absolute-fill transition-opacity duration-1000"
		:class="
			isCurrentSlide ? 'z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
		"
		:aria-hidden="!isCurrentSlide"
	>
		<MediaCoverImage
			v-if="heroBackdropSrc"
			:src="heroBackdropSrc"
			:alt="show.name"
			layout="fill"
			:loading="isCurrentSlide ? 'eager' : 'lazy'"
			:fetchpriority="isCurrentSlide ? 'high' : 'low'"
			sizes="100vw"
			class="ui-dashboard-featured-image"
			:class="isCurrentSlide ? 'scale-[1.03]' : 'scale-100'"
		/>
		<div class="ui-absolute-fill ui-overlay-gradient-fade" />
		<div class="ui-overlay-hero-scrim" />

		<div class="ui-hero-content-shell">
			<div class="max-w-2xl">
				<div v-if="hasMetaRow" class="ui-featured-slide-meta-row">
					<span
						v-if="displayMeta.hasRatingAverage"
						class="ui-featured-slide-rating"
					>
						<Star class="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
						{{ displayMeta.ratingAverageLabel }}
					</span>
					<AppText
						v-if="displayMeta.hasRatingAverage && displayMeta.genresLabel.length > 0"
						as="span"
						variant="muted"
					>
						·
					</AppText>
					<AppText
						v-if="displayMeta.genresLabel.length > 0"
						as="span"
						variant="mutedXs"
						class="md:text-sm"
					>
						{{ displayMeta.genresLabel }}
					</AppText>
				</div>
				<AppHeading variant="heroFeature">{{ show.name }}</AppHeading>
				<AppText variant="heroFeatureSummary">
					{{ displayMeta.plainSummary }}
				</AppText>
				<div class="ui-featured-slide-actions">
					<PillLink :to="showDetailPath" variant="primary">
						<Play class="h-4 w-4 fill-current" aria-hidden="true" />
						Watch Trailer
					</PillLink>
					<PillLink :to="showDetailPath" variant="soft">
						<Info class="h-4 w-4" aria-hidden="true" />
						More Info
					</PillLink>
				</div>
			</div>
		</div>
	</div>
</template>
