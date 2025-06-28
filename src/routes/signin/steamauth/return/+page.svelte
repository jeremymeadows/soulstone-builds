<script lang="ts">
	import { onMount } from 'svelte';

    const { data } = $props();
    const { user } = data;

    onMount(() => {
        if (user) {
            localStorage.setItem('user', user.name);
        } else {
            localStorage.removeItem('user')
        }
        document.location.href = '/';
    })
</script>