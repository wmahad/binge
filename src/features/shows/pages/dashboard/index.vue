<script setup lang="ts">
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
		<p class="mt-2 text-zinc-400">TV shows by genre will appear here.</p>
		<nav class="mt-6 flex flex-wrap gap-4 text-sm text-sky-400 underline-offset-4 hover:underline">
			<router-link to="/search">Search</router-link>
			<router-link to="/shows/1">Sample show</router-link>
			<router-link to="/genres/Drama">Genre: Drama</router-link>
		</nav>
	</div>
</template>
