<script setup lang="ts">
defineProps<{
	id: string;
}>();
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-semibold tracking-tight text-white">Show details</h1>
		<p class="mt-2 text-zinc-400">Show ID: {{ id }}</p>
		<nav class="mt-6">
			<router-link class="text-sm text-sky-400 underline-offset-4 hover:underline" to="/">
				← Dashboard
			</router-link>
		</nav>
	</div>
</template>
