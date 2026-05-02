<script setup lang="ts">
import type { Show } from "@generated";
import { AppHeading, AppSurface, AppText, RatingStarsDisplay } from "@src/components";
import {
	showHeroOverline,
	showPremiereYearsLabel,
} from "@src/features/shows/detail/utils/showFormatting";
import { isNullish } from "@src/utils";
import { computed } from "vue";

const props = defineProps<{
	show: Show;
	summaryPlain: string;
	rating: number | null;
	filledStarCount: number;
}>();

const overlineLabel = computed(() => showHeroOverline(props.show));

const premiereYearsLabel = computed(() =>
	showPremiereYearsLabel(props.show),
);

const hasPremiereYears = computed(() => !isNullish(premiereYearsLabel.value));

const hasStatus = computed(() => !isNullish(props.show.status));
</script>

<template>
	<div>
		<AppText variant="overline" as="span">
			{{ overlineLabel }}
		</AppText>

		<AppHeading variant="hero">{{ show.name }}</AppHeading>

		<div class="mb-3 flex flex-wrap items-center gap-4 text-sm">
			<RatingStarsDisplay
				:rating="rating"
				:filled-star-count="filledStarCount"
			/>
			<AppText
				v-if="hasPremiereYears"
				variant="muted-inline"
				as="span"
				class="text-sm"
			>
				{{ premiereYearsLabel }}
			</AppText>
			<AppText v-if="hasStatus" variant="eyebrow" as="span">
				{{ show.status }}
			</AppText>
		</div>

		<div class="mb-6 ui-chip-row">
			<AppSurface
				v-for="genre in show.genres"
				:key="genre"
				as="span"
				variant="pill"
				class="px-3 py-1"
			>
				<AppText variant="caption" as="span">
					{{ genre }}
				</AppText>
			</AppSurface>
		</div>

		<AppText variant="heroLead">
			{{ summaryPlain }}
		</AppText>
	</div>
</template>
