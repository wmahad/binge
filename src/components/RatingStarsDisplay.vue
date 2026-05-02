<script setup lang="ts">
import { formatNumberOrEmpty, isNullish } from "@src/utils";
import { Star } from "lucide-vue-next";
import { computed } from "vue";

const STAR_INDICES = [0, 1, 2, 3, 4] as const;

const props = defineProps<{
	filledStarCount: number;
	rating: number | null;
}>();

const ratingLabel = computed(() => {
	const formatted = formatNumberOrEmpty(props.rating, 1);
	return formatted.length > 0 ? formatted : null;
});

const hasRatingLabel = computed(() => !isNullish(ratingLabel.value));

function starIconClass(starIndex: number) {
	return starIndex < props.filledStarCount
		? "fill-primary text-primary"
		: "text-muted-foreground/40";
}
</script>

<template>
	<div class="ui-rating-stars">
		<Star
			v-for="starIndex in STAR_INDICES"
			:key="starIndex"
			class="h-4 w-4"
			:class="starIconClass(starIndex)"
			aria-hidden="true"
		/>
		<span v-if="hasRatingLabel" class="ui-rating-stars-label">{{
			ratingLabel
		}}</span>
	</div>
</template>
