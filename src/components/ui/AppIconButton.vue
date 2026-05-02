<script setup lang="ts">
import AppButton from "./AppButton.vue";

withDefaults(
	defineProps<{
		variant?: "ghost" | "overlay";
		size?: "icon" | "icon-lg";
		type?: "button" | "submit";
	}>(),
	{ variant: "ghost", size: "icon", type: "button" },
);

const emit = defineEmits<{
	click: [event: MouseEvent];
}>();
</script>

<template>
	<AppButton
		:variant="variant"
		:size="size"
		:type="type"
		class="p-0"
		@click="emit('click', $event)"
	>
		<slot />
	</AppButton>
</template>
