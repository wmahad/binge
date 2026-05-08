<script setup lang="ts">
import { type CastMember, useGetShowCast } from "@generated";
import {
	AppText,
	PersonPortrait,
	ScrollableRow,
	SectionTitleRow,
} from "@src/components";
import { preferredImageUrl } from "@src/features/shows/detail/utils/mediaUrls";
import { prefetchImageUrl } from "@src/utils";
import { computed, toValue, watch } from "vue";

const props = defineProps<{
	showId: number;
}>();

const castQuery = useGetShowCast(() => props.showId);

const cast = computed<CastMember[]>(() => castQuery.data.value ?? []);
const showLoadingState = computed(
	() => toValue(castQuery.isPending) && cast.value.length === 0,
);

const MAX_CAST_IMAGE_PREFETCH = 12;

watch(
	cast,
	(members) => {
		for (const member of members.slice(0, MAX_CAST_IMAGE_PREFETCH)) {
			prefetchImageUrl(preferredImageUrl(member.person.image));
		}
	},
	{ immediate: true },
);
</script>

<template>
	<section v-if="showLoadingState" class="ui-page-section">
		<div class="ui-skeleton-section-title" />
		<div class="ui-skeleton-content-rail">
			<div
				v-for="key in [0, 1, 2, 3, 4, 5]"
				:key="key"
				class="ui-skeleton-cast-item"
			>
				<div class="animate-pulse ui-skeleton-pill mx-auto h-24 w-24" />
				<div class="animate-pulse ui-skeleton-block h-3 w-20" />
				<div class="animate-pulse ui-skeleton-block h-2.5 w-16" />
			</div>
		</div>
	</section>
	<section v-else-if="cast.length > 0" class="ui-page-section">
		<SectionTitleRow title="Top Cast" layout="standalone" />
		<ScrollableRow variant="detailInset">
			<div
				v-for="member in cast"
				:key="member.person.id"
				class="ui-cast-portrait-item"
			>
				<PersonPortrait
					:image-url="preferredImageUrl(member.person.image)"
					:alt="member.person.name"
					frame="cast-rail"
					empty-label="No photo"
				/>
				<AppText variant="body" class="line-clamp-1 text-xs font-semibold">
					{{ member.person.name }}
				</AppText>
				<AppText variant="mutedXs" class="line-clamp-1">
					{{ member.character.name }}
				</AppText>
			</div>
		</ScrollableRow>
	</section>
</template>
