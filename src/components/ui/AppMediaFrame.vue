<script setup lang="ts">
import { computed } from "vue";

const BASE_CLASS = "relative aspect-2/3 shrink-0 overflow-hidden bg-muted";
const MEDIA_FRAME_CLASS = {
	poster: "w-full min-h-0",
	listPoster: "w-21 rounded-xl ring-1 ring-border/40 sm:w-24 md:w-25",
} as const;

const props = withDefaults(
	defineProps<{
		variant?: "poster" | "listPoster";
	}>(),
	{ variant: "poster" },
);

const frameClass = computed(
	() => `${BASE_CLASS} ${MEDIA_FRAME_CLASS[props.variant]}`,
);
</script>

<template>
	<div :class="frameClass">
		<slot />
	</div>
</template>
