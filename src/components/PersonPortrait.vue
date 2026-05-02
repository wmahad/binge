<script setup lang="ts">
import { computed } from "vue";

import MediaPortraitImage from "./ui/MediaPortraitImage.vue";

const props = defineProps<{
	imageUrl: string | null;
	alt: string;
	frame: "cast-rail" | "compact";
	initials?: string;
	emptyLabel?: string;
}>();

const FRAME_CLASS = {
	"cast-rail": "ui-person-portrait-frame-cast-rail",
	compact: "ui-person-portrait-frame-compact",
} as const;

const frameClass = computed(() =>
	FRAME_CLASS[props.frame],
);

const portraitSizes = computed(() =>
	props.frame === "compact" ? "48px" : "112px",
);

const fallbackText = computed(() => {
	if (props.initials?.trim()) return props.initials.trim();
	return props.emptyLabel ?? "";
});
</script>

<template>
	<div :class="frameClass">
		<MediaPortraitImage
			v-if="imageUrl"
			:src="imageUrl"
			:alt="alt"
			:sizes="portraitSizes"
		/>
		<div
			v-else
			class="ui-media-fallback"
		>
			{{ fallbackText }}
		</div>
	</div>
</template>
