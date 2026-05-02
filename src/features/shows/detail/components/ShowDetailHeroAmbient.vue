<script setup lang="ts">
import { MediaCoverImage } from "@src/components";

defineProps<{
	heroImageUrl: string | null;
}>();
</script>

<template>
	<template v-if="heroImageUrl">
		<div class="ui-absolute-fill -z-10 lg:hidden">
			<MediaCoverImage
				:src="heroImageUrl"
				alt=""
				layout="fill"
				loading="eager"
				fetchpriority="high"
				sizes="100vw"
				class="object-[50%_18%]"
				aria-hidden="true"
			/>
			<div class="ui-absolute-fill ui-detail-ambient-mobile-top" />
			<div class="ui-absolute-fill ui-detail-ambient-mobile-bottom" />
		</div>

		<div class="ui-absolute-fill -z-10 hidden lg:block">
			<MediaCoverImage
				:src="heroImageUrl"
				alt=""
				layout="fill"
				loading="lazy"
				fetchpriority="low"
				sizes="50vw"
				class="scale-110 opacity-20 blur-2xl"
				aria-hidden="true"
			/>
			<div class="ui-absolute-fill bg-background/60" />
		</div>
	</template>
</template>
