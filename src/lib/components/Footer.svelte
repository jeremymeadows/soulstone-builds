<script lang="ts">
	let { height = $bindable() } = $props();
</script>

<div bind:clientHeight={height}>
	<div style:text-align="center">
		<a href="https://github.com/jeremymeadows/soulstone-builds">
			<img
				src="https://img.shields.io/badge/jeremymeadows/soulstone--builds-202020?logo=github"
				alt="github link"
			/>
		</a>
	</div>
</div>

<style lang="scss">
	div {
		padding-bottom: 0.1rem;
	}
	a {
		color: var(--fg);
	}
	img {
		height: 1em;
	}
</style>
