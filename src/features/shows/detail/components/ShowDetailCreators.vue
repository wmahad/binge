<script setup lang="ts">
import { getShowCrew } from "@generated";
import { AppSurface, AppText, PersonPortrait, SectionTitleRow } from "@src/components";
import { preferredImageUrl } from "@src/features/shows/detail/utils/mediaUrls";
import { pickCreators } from "@src/features/shows/detail/utils/pickCreators";
import { initialsFromName } from "@src/utils";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

const props = defineProps<{
	showName: string;
	showId: number;
}>();

const crewQuery = useQuery({
	queryKey: computed(() => ["show-crew", props.showId] as const),
	queryFn: async () => {
		try {
			return (await getShowCrew(props.showId)) ?? [];
		} catch {
			return [];
		}
	},
});

const creators = computed(() => pickCreators(crewQuery.data.value ?? []));
</script>

<template>
	<div v-if="creators.length > 0" class="ui-page-section">
		<SectionTitleRow title="Created By" layout="withKicker">
			<template #kicker>The minds behind {{ showName }}</template>
		</SectionTitleRow>
		<div class="flex flex-wrap gap-4">
			<AppSurface
				v-for="creator in creators"
				:key="`${creator.person.id}-${creator.type}`"
				variant="pill"
				class="flex items-center gap-3 py-2 pl-2 pr-5"
			>
				<PersonPortrait
					:image-url="preferredImageUrl(creator.person.image)"
					:alt="creator.person.name"
					frame="compact"
					:initials="initialsFromName(creator.person.name)"
				/>
				<div>
					<AppText variant="body" class="text-sm font-semibold leading-tight">
						{{ creator.person.name }}
					</AppText>
					<AppText variant="mutedXs">{{ creator.type }}</AppText>
				</div>
			</AppSurface>
		</div>
	</div>
</template>
