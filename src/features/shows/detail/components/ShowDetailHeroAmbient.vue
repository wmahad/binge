<script setup lang="ts">
import { MediaCoverImage } from "@src/components";

defineProps<{
	heroImageUrl: string | null;
}>();
</script>

<template>
	<template v-if="heroImageUrl">
		<div class="ui-detail-ambient-mobile">
			<MediaCoverImage
				:src="heroImageUrl"
				alt=""
				layout="fill"
				loading="eager"
				fetchpriority="high"
				sizes="100vw"
				class="z-0 object-[50%_18%]"
				aria-hidden="true"
			/>
		</div>

		<div class="ui-detail-ambient-desktop">
			<MediaCoverImage
				:src="heroImageUrl"
				alt=""
				layout="fill"
				loading="lazy"
				fetchpriority="low"
				sizes="50vw"
				class="z-0 scale-110 opacity-20 blur-2xl"
				aria-hidden="true"
			/>
		</div>
	</template>
</template>
