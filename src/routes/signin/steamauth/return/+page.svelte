<script lang="ts">
	import { onMount } from 'svelte';

    const { data } = $props();
    const { profile } = data;

    onMount(() => {
        if (profile) {
            localStorage.setItem('profile', JSON.stringify(profile));
        } else {
            localStorage.removeItem('profile')
        }
        document.location.href = '/';
    })
</script>