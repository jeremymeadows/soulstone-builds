<script lang="ts">
	import { onMount } from 'svelte';

    const { data } = $props();
    const { profile } = data;

    onMount(() => {
    console.log('steamauth return data:', profile);
        localStorage.setItem('profile', JSON.stringify(profile));
        document.location.href = '/';
    })
</script>