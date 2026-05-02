<script setup lang="ts">
import type { Show } from "@generated";
import { MediaActionTile } from "@src/components";
import {
	buildShowHeroActionItems,
	type ShowHeroActionItem,
} from "@src/features/shows/detail/utils/buildShowHeroActionItems";
import { computed } from "vue";

const props = defineProps<{
	show: Show;
}>();

const emit = defineEmits<{
	share: [];
}>();

const actions = computed(() => buildShowHeroActionItems(props.show));

function onTileClick(action: ShowHeroActionItem) {
	if (action.isShare) emit("share");
}
</script>

<template>
	<div class="ui-detail-hero-actions-grid">
		<MediaActionTile
			v-for="action in actions"
			:key="action.id"
			:variant="action.variant"
			:href="action.href"
			:external="action.external"
			:native-type="action.nativeType"
			@click="onTileClick(action)"
		>
			<template #icon>
				<component
					:is="action.icon"
					class="h-4 w-4"
					:class="action.iconClass"
					aria-hidden="true"
				/>
			</template>
			{{ action.label }}
		</MediaActionTile>
	</div>
</template>
