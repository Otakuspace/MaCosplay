<script lang="ts">
	let { children } = $props();
</script>

<div class="brainstorm-layout">
	{@render children()}
</div>

<style>
	.brainstorm-layout {
		min-height: calc(100vh - 4rem);
	}
</style>