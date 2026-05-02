<script setup lang="ts">
import type { Season, Show } from "@generated";
import { AppSurface, AppText, MediaCoverImage } from "@src/components";
import { preferredImageUrl } from "@src/features/shows/detail/utils/mediaUrls";
import {
	formatSeasonAirYearRange,
	formatSeasonEpisodeLabel,
} from "@src/features/shows/detail/utils/seasonFormatting";
import { isNullish } from "@src/utils";
import { computed } from "vue";

const props = defineProps<{
	show: Show;
	season: Season;
}>();

const primaryPosterSrc = computed(() => preferredImageUrl(props.season.image));
const fallbackPosterSrc = computed(() => preferredImageUrl(props.show.image));
const posterSrc = computed(() => primaryPosterSrc.value ?? fallbackPosterSrc.value);
const hasPosterSrc = computed(() => !isNullish(posterSrc.value));
const posterOpacityClass = computed(() =>
	isNullish(primaryPosterSrc.value) ? "opacity-60" : "",
);

const seasonPosterAlt = computed(() => `Season ${props.season.number}`);

const episodeCountLabel = computed(() =>
	formatSeasonEpisodeLabel(props.season),
);

const airYearRangeLabel = computed(() =>
	formatSeasonAirYearRange(props.season),
);

const hasAirYearRange = computed(() => !isNullish(airYearRangeLabel.value));
</script>

<template>
	<AppSurface class="ui-season-card-shell">
		<div class="ui-season-card-poster-frame">
			<MediaCoverImage
				v-if="hasPosterSrc"
				:src="posterSrc ?? ''"
				:alt="seasonPosterAlt"
				sizes="min(18rem, 42vw)"
				:class="['object-[center_top]', posterOpacityClass]"
			/>
			<div class="ui-absolute-fill ui-season-poster-overlay" />
			<div class="ui-season-card-overlay-content">
				<AppText variant="eyebrow" class="ui-season-card-kicker block">
					Season
				</AppText>
				<AppText
					as="p"
					variant="body"
					class="ui-season-card-digit text-3xl font-bold leading-none tabular-nums"
				>
					{{ season.number }}
				</AppText>
			</div>
		</div>
		<div class="ui-season-card-meta">
			<AppText variant="caption" as="p">{{ episodeCountLabel }}</AppText>
			<AppText v-if="hasAirYearRange" variant="caption" as="p">
				{{ airYearRangeLabel }}
			</AppText>
		</div>
	</AppSurface>
</template>
