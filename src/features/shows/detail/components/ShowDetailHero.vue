<script setup lang="ts">
import type { Season, Show } from "@generated";
import { MediaCoverImage } from "@src/components";

import ShowDetailHeroActions from "./ShowDetailHeroActions.vue";
import ShowDetailHeroAmbient from "./ShowDetailHeroAmbient.vue";
import ShowDetailHeroFacts from "./ShowDetailHeroFacts.vue";
import ShowDetailHeroIntro from "./ShowDetailHeroIntro.vue";

defineProps<{
	show: Show;
	heroImageUrl: string | null;
	summaryPlain: string;
	rating: number | null;
	filledStarCount: number;
	totalEpisodes: number;
	seasons: Season[];
}>();

const emit = defineEmits<{
	share: [];
}>();
</script>

<template>
	<section class="relative isolate overflow-hidden">
		<ShowDetailHeroAmbient :hero-image-url="heroImageUrl" />

		<div class="ui-detail-hero-grid">
			<div class="ui-detail-hero-content-column">
				<ShowDetailHeroIntro
					:show="show"
					:summary-plain="summaryPlain"
					:rating="rating"
					:filled-star-count="filledStarCount"
				/>

				<ShowDetailHeroActions :show="show" @share="emit('share')" />

				<ShowDetailHeroFacts
					:show="show"
					:seasons="seasons"
					:total-episodes="totalEpisodes"
				/>
			</div>

			<div class="ui-detail-hero-sidepanel-shell">
				<template v-if="heroImageUrl">
					<MediaCoverImage
						:src="heroImageUrl"
						:alt="show.name"
						layout="fill"
						loading="eager"
						fetchpriority="high"
						sizes="(min-width: 1024px) 45vw, 100vw"
						class="object-[50%_30%]"
					/>
					<div class="ui-detail-sidepanel-left-fade" />
				</template>
			</div>
		</div>
	</section>
</template>
