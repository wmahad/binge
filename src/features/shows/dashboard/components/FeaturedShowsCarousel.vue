<script setup lang="ts">
import type { Show } from "@generated";
import { CarouselDotNavigation } from "@src/components";
import { prefetchImageUrl } from "@src/utils";
import { onUnmounted, ref, watch, watchEffect } from "vue";

import FeaturedShowSlide from "./FeaturedShowSlide.vue";

const props = defineProps<{
	shows: Show[];
}>();

const activeSlideIndex = ref(0);
const isRotationPaused = ref(false);
const AUTO_ROTATION_INTERVAL_MS = 7000;

let timer: ReturnType<typeof setInterval> | undefined;

function clearRotationTimer() {
	if (!timer) return;
	clearInterval(timer);
	timer = undefined;
}

function startRotationTimer() {
	if (isRotationPaused.value || props.shows.length <= 1) return;
	timer = setInterval(() => {
		activeSlideIndex.value = (activeSlideIndex.value + 1) % props.shows.length;
	}, AUTO_ROTATION_INTERVAL_MS);
}

watchEffect((onCleanup) => {
	clearRotationTimer();
	startRotationTimer();
	onCleanup(() => {
		clearRotationTimer();
	});
});

watch(
	() => props.shows,
	(shows) => {
		for (const show of shows.slice(0, 4)) {
			const url = show.image?.original ?? show.image?.medium ?? null;
			prefetchImageUrl(url);
		}
	},
	{ immediate: true },
);

onUnmounted(() => {
	clearRotationTimer();
});
</script>

<template>
	<section
		class="ui-dashboard-hero-shell z-20"
		@mouseenter="isRotationPaused = true"
		@mouseleave="isRotationPaused = false"
	>
		<!-- Slides only: overflow clips imagery, not the dot strip -->
		<div class="ui-absolute-fill overflow-hidden">
			<FeaturedShowSlide
				v-for="(show, slideIndex) in shows"
				:key="show.id"
				:show="show"
				:is-current-slide="slideIndex === activeSlideIndex"
			/>
		</div>

		<CarouselDotNavigation
			v-model:active-index="activeSlideIndex"
			:slide-count="shows.length"
			aria-label="Featured slides"
		/>
	</section>
</template>
