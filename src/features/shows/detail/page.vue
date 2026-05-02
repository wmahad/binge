<script setup lang="ts">
import { useGetShowById } from "@generated";
import { errorMessageFromUnknown, parseFiniteNumber } from "@src/utils";
import { computed, watch } from "vue";

import ShowDetailContent from "./components/ShowDetailContent.vue";
import ShowDetailSkeleton from "./components/ShowDetailSkeleton.vue";

const props = defineProps<{
	id: string;
}>();

const showId = computed(() => parseFiniteNumber(props.id));

const {
	data: detailShow,
	isPending: loading,
	error,
	isError,
} = useGetShowById(showId);

watch(
	() => props.id,
	() => {
		window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
	},
);

const loadErrorMessage = computed(() =>
	errorMessageFromUnknown(error.value, "Something went wrong"),
);
</script>

<template>
	<div class="min-h-screen">
		<ShowDetailSkeleton v-if="loading" />
		<div
			v-else-if="isError"
			class="ui-detail-error-state"
			role="alert"
		>
			{{ loadErrorMessage }}
		</div>
		<ShowDetailContent
			v-else-if="detailShow"
			:show="detailShow"
		/>
	</div>
</template>
