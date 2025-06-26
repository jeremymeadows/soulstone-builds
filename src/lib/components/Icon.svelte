<script lang="ts">
	export const {
		name,
		size = '1em',
        width = size,
        height = "1em",
		color = 'currentColor',
		translate = '0 0',
		rotate = '0deg'
	} = $props();

	let classlist = ['nf', `nf-${name}`];
</script>

<span 
    class="icon {classlist.join(' ')}"
    style:color
    style:font-size={size}
    style:width
    style:height
    style:transform={`translate(${translate})`}
    style:rotate
></span>

<style lang="scss">
	@import 'https://www.nerdfonts.com/assets/css/webfont.css';

	.icon {
		display: inline-block;
		justify-content: center;
		align-items: center;
	}

	.icon::before {
		animation-duration: 10000;
		animation-delay: 0;
		animation-timing-function: linear;
	}
</style>
