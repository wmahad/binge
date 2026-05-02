<script setup lang="ts">
import type { Show } from "@generated";
import {
	AppContainer,
	AppHeading,
	AppIconButton,
	AppKicker,
	AppSectionHeader,
	ShowCard,
} from "@src/components";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, useTemplateRef } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
	genre: string;
	shows: Show[];
}>();

const rowEl = useTemplateRef<HTMLDivElement>("rowEl");

const genreExplorePath = computed(
	() => `/genres/${encodeURIComponent(props.genre)}`,
);

const ROW_NAV_BUTTONS = [
	{
		id: "left",
		sideClass: "left-2",
		ariaLabel: "Scroll left",
		direction: "l" as const,
	},
	{
		id: "right",
		sideClass: "right-2",
		ariaLabel: "Scroll right",
		direction: "r" as const,
	},
] as const;

function scroll(direction: "l" | "r") {
	const track = rowEl.value;
	if (!track) return;
	track.scrollBy({
		left: (direction === "l" ? -1 : 1) * track.clientWidth * 0.8,
		behavior: "smooth",
	});
}
</script>

<template>
	<section v-if="props.shows.length > 0" class="group/row relative py-3">
		<AppContainer variant="inset" class="mb-2.5">
			<AppSectionHeader>
				<template #title>
					<AppHeading
						variant="rowTitle"
						:level="2"
						class="uppercase text-foreground"
					>
						{{ genre }}
						<AppKicker variant="sectionMeta" class="ml-1.5 md:ml-2">
							Top rated
						</AppKicker>
					</AppHeading>
				</template>
				<template #action>
					<RouterLink
						:to="genreExplorePath"
						class="group/nav ui-nav-link"
					>
						View all
						<ArrowRight
							class="h-3.5 w-3.5 transition-transform group-hover/nav:translate-x-0.5"
							aria-hidden="true"
						/>
					</RouterLink>
				</template>
			</AppSectionHeader>
		</AppContainer>

		<div class="relative">
			<AppIconButton
				v-for="navButton in ROW_NAV_BUTTONS"
				:key="navButton.id"
				variant="overlay"
				size="icon-lg"
				class="ui-genre-row-nav-button"
				:class="navButton.sideClass"
				:aria-label="navButton.ariaLabel"
				@click="scroll(navButton.direction)"
			>
				<ChevronLeft
					v-if="navButton.direction === 'l'"
					class="h-6 w-6"
					aria-hidden="true"
				/>
				<ChevronRight
					v-else
					class="h-6 w-6"
					aria-hidden="true"
				/>
			</AppIconButton>
			<AppContainer variant="inset">
				<div
					ref="rowEl"
					role="list"
					class="ui-scroll-rail-posters ui-scroll-rail-base"
				>
					<ShowCard
						v-for="show in shows"
						:key="show.id"
						role="listitem"
						:show="show"
					/>
				</div>
			</AppContainer>
		</div>
	</section>
</template>
