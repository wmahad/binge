<script setup lang="ts">
import { Search } from "lucide-vue-next";

const searchQuery = defineModel<string>({ required: true });
const SEARCH_LABEL = "Search TV shows";

defineProps<{
	iconLeftClass?: string;
	autofocus?: boolean;
}>();

const emit = defineEmits<{
	submit: [event: SubmitEvent];
}>();

function onSubmit(event: SubmitEvent) {
	event.preventDefault();
	emit("submit", event);
}
</script>

<template>
	<form class="relative" @submit="onSubmit">
		<Search
			class="ui-search-input-icon"
			:class="iconLeftClass ?? 'left-3'"
			aria-hidden="true"
		/>
		<input
			v-model="searchQuery"
			type="search"
			:placeholder="`${SEARCH_LABEL}…`"
			:aria-label="SEARCH_LABEL"
			class="ui-search-input-field"
			autocomplete="off"
			:autofocus="autofocus"
		/>
	</form>
</template>
