<script setup lang="ts">

import { AppIconButton } from "@src/components";
import { useTheme } from "@src/composables";
import { Moon, Sun } from "lucide-vue-next";

const { theme, toggleTheme } = useTheme();
</script>

<template>
	<AppIconButton
		variant="ghost"
		size="icon"
		:aria-label="
			theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
		"
		:title="theme === 'dark' ? 'Light mode' : 'Dark mode'"
		@click="toggleTheme"
	>
		<span class="ui-theme-toggle-icon-slot ui-icon-sm" aria-hidden="true">
			<Sun v-if="theme === 'dark'" class="ui-icon-sm" />
			<Moon v-else class="ui-icon-sm" />
		</span>
	</AppIconButton>
</template>
