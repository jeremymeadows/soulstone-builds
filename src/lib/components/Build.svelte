<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';
	import { select } from '$lib';
	import { load_sync, img_name } from '$lib/assets/images';

	const { data } = $props();
	const { editable, characters, skills, runes, tags } = data;

	const images = load_sync();

	let saved_build = data.build;
	let build = $state(data.build);
	let liked = $state(data.liked);

	let skill_filter = $state('');
	let rune_filter = $state('');

	let dirty = $derived(
		JSON.stringify({ ...saved_build, votes: null }) !== JSON.stringify({ ...build, votes: null })
	);
	let ndx = 0;

	function reset() {
		build = saved_build;
	}

	function toggleTag(tag: string) {
		if (build.tags.includes(tag)) {
			build.tags = build.tags.filter((t: string) => t !== tag);
		} else {
			build.tags = [...build.tags, tag];
		}
	}

	function save() {
		axios
			.post(page.url.pathname, build)
			.then((res) => {
				if (!build.id) {
					window.location.href = `/builds/id/${res.data}`;
				}
				saved_build = $state.snapshot(build);
				dirty = false;
			})
			.catch((error) => {
				console.error('Error saving build:', error);
			});
	}

	function del() {
		if (confirm('Are you sure you want to delete this build?')) {
			axios
				.delete(page.url.pathname, {
					data: { id: build.id }
				})
				.then(() => {
					window.location.href = '/';
				})
				.catch((error) => {
					console.error('Error deleting build:', error);
				});
		}
	}

	function like() {
		axios
			.patch(page.url.pathname, { id: build.id, vote: !liked })
			.then(() => {
				liked = !liked;
				build.votes! += liked ? 1 : -1;
			})
			.catch((error) => {
				console.error('Error liking build:', error);
			});
	}

	onMount(() => {
		if (editable) {
			(document.querySelectorAll('[data-modal-open]') || []).forEach((trigger) => {
				const modal = trigger.getAttribute('data-modal-open')!;
				const target = document.getElementById(modal)!;

				trigger.addEventListener('click', () => {
					target.classList.add('is-active');
				});
			});

			(document.querySelectorAll('[data-modal-close]') || []).forEach((trigger) => {
				const modal = trigger.getAttribute('data-modal-close')!;
				const target = document.getElementById(modal)!;

				trigger.addEventListener('click', () => {
					target.classList.remove('is-active');
				});
			});

			document.addEventListener('keydown', (event) => {
				if (event.key === 'Escape') {
					(document.querySelectorAll('.modal') || []).forEach((modal) => {
						modal.classList.remove('is-active');
					});
				}
			});
		}
	});
</script>

<div class="build">
	<div class="columns">
		{#if build.id}
			<div class="column">
				<button onclick={like}>
					<Icon name="md-thumb_up" color={liked ? 'green' : 'var(--text)'} />
					{build.votes}
				</button>
			</div>
			<div class="column" style="text-align: right;">
				{build.user_name}
			</div>
		{/if}
	</div>

	<div class="name center">
		{#if editable}
			<h1>
				<span id="name" contenteditable bind:innerText={build.name}>
					{build.name}
				</span>
				<button onclick={() => select('#name')}>
					<Icon name="fa-edit" size="0.5em" translate="0, -0.4em" />
				</button>
			</h1>
		{:else}
			<h1 id="name">{build.name}</h1>
		{/if}
	</div>

	<div class="character center">
		<img
			src={images.characters[img_name(build.character)]}
			alt={build.character}
			data-tooltip={build.character}
			data-modal-open="select-character"
		/>
		<img
			src={images.weapons[img_name(build.weapon)]}
			alt={build.weapon}
			data-tooltip={build.weapon}
			data-modal-open="select-weapon"
		/>
	</div>

	<div class="skills columns center">
		{#each build.skills as skill, i}
			<div class="column">
				<button onclick={() => (ndx = i)} data-modal-open="select-skill">
					<img src={images.skills[img_name(skill)]} alt={skill} data-tooltip={skill} />
				</button>
			</div>
		{/each}
	</div>

	<div class="runes">
		<div class="versatility center">
			{#each build.runes.versatility as rune, i}
				<button onclick={() => (ndx = i)} data-tooltip={rune} data-modal-open="select-versatility">
					<span class="stack">
						<img src={images.runes['RuneBuildFrame']} alt="" class="frame" />
						{#if rune !== '_empty'}
							<img src={images.runes[img_name(rune)]} alt={rune} class="icon" />
						{/if}
					</span>
				</button>
			{/each}
		</div>
		<div class="tenacity center">
			{#each build.runes.tenacity as rune, i}
				<button onclick={() => (ndx = i)} data-tooltip={rune} data-modal-open="select-tenacity">
					<div class="stack">
						<img src={images.runes['RuneBuildFrame']} alt="" class="frame" />
						{#if rune !== '_empty'}
							<img src={images.runes[img_name(rune)]} alt={rune} class="icon" />
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<h3 class="center">Tags</h3>

	<div class="tags center are-medium">
		{#each editable ? tags : tags.filter((tag: string) => build.tags.includes(tag)) as tag}
			<button
				class="button tag"
				class:is-selected={build.tags.includes(tag)}
				onclick={editable ? () => toggleTag(tag) : null}
				disabled={!editable}
			>
				{tag}
			</button>
		{/each}
	</div>

	{#if editable}
		<textarea
			class="input"
			placeholder="Description"
			bind:value={build.notes}
			style="width: 100%; height: 10em; resize: vertical;"
		></textarea>
	{:else if build.notes}
		<p>{build.notes}</p>
	{/if}

	<div style:text-align="right">
		Patch: {build.patch}
	</div>
</div>

<br />

{#if editable}
	<div class="center">
		<button class="button" onclick={reset} disabled={!dirty}>Reset</button>
		<button class="button" onclick={save} disabled={!dirty}>Save</button>
	</div>
	<br />
	{#if build.id}
		<div class="center">
			<button class="button" onclick={del}>Delete</button>
		</div>
	{/if}

	<div id="select-character" class="modal">
		<div class="modal-background" data-modal-close="select-character"></div>
		<div class="modal-card">
			<section class="modal-card-body">
				<div class="columns is-multiline is-centered">
					{#each Object.keys(characters) as character}
						<div class="column is-2">
							<button
								onclick={() => {
									build.character = character;
									build.weapon = characters[character as keyof typeof characters].weapons[0];
								}}
								data-modal-close="select-character"
							>
								<img
									src={images.characters[img_name(character)]}
									alt={character}
									data-tooltip={character}
								/>
							</button>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<div id="select-weapon" class="modal">
		<div class="modal-background" data-modal-close="select-weapon"></div>
		<div class="modal-card">
			<section class="modal-card-body">
				<div class="columns is-multiline is-centered">
					{#each characters[build.character as keyof typeof characters].weapons as weapon}
						<div class="column is-2">
							<button onclick={() => (build.weapon = weapon)} data-modal-close="select-weapon">
								<img
									src={images.weapons[img_name(weapon)]}
									alt={weapon.replace(/^_/, '')}
									data-tooltip={weapon}
								/>
							</button>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<div id="select-skill" class="modal">
		<div class="modal-background" data-modal-close="select-skill"></div>
		<div class="modal-card">
			<section class="modal-card-body">
				<input class="input" placeholder="Search skills..." type="text" bind:value={skill_filter} />
				<br /><br />
				<div class="columns is-multiline is-centered">
					{#each skills as skill}
						<div
							class="column is-2"
							style:display={skill.toLowerCase().includes(skill_filter.toLowerCase()) ? 'block' : 'none'}
						>
							<button onclick={() => (build.skills[ndx] = skill)} data-modal-close="select-skill">
								<img src={images.skills[img_name(skill)]} alt={skill} data-tooltip={skill} />
							</button>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<div id="select-versatility" class="modal">
		<div class="modal-background" data-modal-close="select-versatility"></div>
		<div class="modal-card">
			<section class="modal-card-body">
				<div class="columns is-multiline is-centered">
					{#each runes.versatility as rune}
						<div class="column is-2">
							<button
								onclick={() => (build.runes.versatility[ndx] = rune)}
								data-modal-close="select-versatility"
							>
								<img src={images.runes[img_name(rune)]} alt={rune} data-tooltip={rune} />
							</button>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<div id="select-tenacity" class="modal">
		<div class="modal-background" data-modal-close="select-tenacity"></div>
		<div class="modal-card">
			<section class="modal-card-body">
				<input class="input" placeholder="Search runes..." type="text" bind:value={rune_filter} />
				<br /><br />
				<div class="columns is-multiline is-centered">
					{#each runes.tenacity as rune}
						<div
							class="column is-2"
							style:display={rune.toLowerCase().includes(rune_filter.toLowerCase()) ? 'block' : 'none'}
						>
							<button
								onclick={() => (build.runes.tenacity[ndx] = rune)}
								data-modal-close="select-tenacity"
							>
								<img src={images.runes[img_name(rune)]} alt={rune} data-tooltip={rune} />
							</button>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>
{/if}

<style lang="scss">
	.build {
		background-color: var(--bg);
		border: 2px solid var(--primary);
		border-radius: 8px;
		padding: 6px;
	}

	.name {
		margin-bottom: 1em;
	}

	h1 {
		margin-bottom: 0;
		width: auto;
	}

	img {
		cursor: pointer;
	}

	.character img {
		height: 200px;
	}

	.skills img {
		width: 100%;
	}

	.runes img.frame {
		width: 150px;
		margin: 0.2em;
	}

	.runes img.icon {
		width: 100%;
		height: 100%;
	}

	.runes .versatility {
		margin-bottom: -5em;

		button {
			clip-path: polygon(50% 100%, 100% 62%, 82% 0, 18% 0, 0 62%);
		}

		.icon {
			transform: translateY(-0.8em);
		}
	}

	.runes .tenacity {
		button {
			clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
		}

		.frame {
			transform: scaleY(-1);
		}

		.icon {
			transform: translateY(0.4em);
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}

	.tag.is-selected {
		background-color: var(--primary);
		color: black;
	}

	.stack {
		position: relative;
		display: inline-block;

		.frame {
			position: relative;
			top: 0;
			left: 0;
		}

		.icon {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
</style>
