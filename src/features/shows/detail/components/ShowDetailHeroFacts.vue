<script setup lang="ts">
import type { Season, Show } from "@generated";
import { buildShowHeroFactRows } from "@src/features/shows/detail/utils/buildShowHeroFactRows";
import { computed } from "vue";

const props = defineProps<{
	show: Show;
	seasons: Season[];
	totalEpisodes: number;
}>();

const factRows = computed(() =>
	buildShowHeroFactRows(props.show, props.seasons, props.totalEpisodes),
);
</script>

<template>
	<div class="ui-detail-hero-facts-row">
		<span
			v-for="row in factRows"
			:key="row.id"
			class="ui-detail-hero-fact-item"
		>
			<component :is="row.icon" class="h-3.5 w-3.5" aria-hidden="true" />
			{{ row.text }}
		</span>
	</div>
</template>
