<script module lang="ts">
    let tooltip: HTMLDivElement | undefined = $state();
    let follow_cursor: boolean = true;

    export function load() {
        document.querySelectorAll('[data-tooltip]').forEach((element) => {
            element.addEventListener('mouseover', () => {
                let text = element.getAttribute('data-tooltip');
                if (tooltip && text) {
                    tooltip.textContent = text;
                    tooltip.hidden = false;

                    if (!follow_cursor) {
                        const el_size = element.getBoundingClientRect();
                        const tt_size = tooltip.getBoundingClientRect();
                        tooltip.style.left = `${el_size.left + el_size.width / 2 - tt_size.width / 2}px`;
                        tooltip.style.top = `${el_size.bottom}px`;
                    }

                    element.addEventListener('mouseout', () => (tooltip!.hidden = true), { once: true });
                }
            });
        });
    }
</script>

<script lang="ts">
	import { navigating, updated } from '$app/state';
	import { onMount } from 'svelte';

    export const {
        follow_cursor = true,
    } = $props();

    onMount(() => {
        if (follow_cursor) {
            console.log('setting')
            document.addEventListener('mousemove', (event) => {
                if (tooltip && !tooltip.hidden) {
                    const tt_size = tooltip.getBoundingClientRect();
                    tooltip.style.left = `${event.pageX - tt_size.width / 4}px`;
                    tooltip.style.top = `${event.pageY + 20}px`;
                }
            });
        }
    });

	$effect(() => {
		Promise.all([navigating.complete, updated.check()]).then(() => {
            load();
		});
	});
</script>

<div class="tooltip" hidden bind:this={tooltip} />

<style lang="scss">
	.tooltip {
		position: absolute;
		background-color: var(--bg);
		padding: 0 0.5em;
		// background-color: red;
        z-index: 1000;
	}
</style>
