<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import { img_name } from '$lib';
	import Icon from '$lib/components/Icon.svelte';

	const { data } = $props();
	const { editable, characters, skills, runes, tags } = data;

	let saved_build = data.build;
	let build = $state(data.build);
	let liked = $state(data.liked);

	let dirty = $derived(JSON.stringify({ ...saved_build, votes: null }) !== JSON.stringify({ ...build, votes: null }));
	let ndx = 0;

	function reset() {
		build = saved_build;
	}

	function toggleTag(tag: string) {
		build.tags ??= []; 
		if (build.tags.includes(tag)) {
			build.tags = build.tags.filter((t) => t !== tag);
		} else {
			build.tags = [...build.tags, tag];
		}
	}

	function save() {
		axios
			.post(page.url.pathname, build)
			.then((res) => {
				if (!build.id) {
					window.location.href = `/builds/${res.data}`;
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
		 <div class="column">
			<button onclick={like}>
				<Icon
					name="md-thumb_up"
					color={liked ? 'green' : 'var(--text)'}
				/> {build.votes}
			</button>
		</div>
		<div class="column" style="text-align: right;">
			{build.user_name}
		</div>
	</div>

	<div class="name center">
		<!-- <h1 id="name" data-modal-open="rename">{build.name}</h1> -->
		{#if editable}
			<h1 id="name" contenteditable bind:innerText={build.name}>{build.name}</h1>
		{:else}
			<h1 id="name">{build.name}</h1>
		{/if}
	</div>

	<div class="character center">
		<img
			src="/imgs/characters/{img_name(build.character)}"
			alt={build.character}
			title={build.character}
			data-modal-open="select-character"
		/>
		<img
			src="/imgs/weapons/{img_name(build.weapon)}"
			alt={build.weapon}
			data-modal-open="select-weapon"
		/>
	</div>

	<div class="skills columns center">
		{#each build.skills as skill, i}
			<div class="column">
				<button onclick={() => (ndx = i)}>
					<img
						src="/imgs/skills/{img_name(skill)}"
						alt={skill}
						data-modal-open="select-skill"
					/>
				</button>
			</div>
		{/each}
	</div>

	<div class="runes">
		<div class="versatility center">
			{#each build.runes.versatility as rune, i}
				<button onclick={() => (ndx = i)} data-modal-open="select-versatility">
					<span class="stack">
						<img src="/imgs/runes/RuneBuildFrame.png" alt="" class="frame" />
						<img src="/imgs/runes/versatility/{img_name(rune)}" alt={rune} class="icon" />
					</span>
				</button>
			{/each}
		</div>
		<div class="tenacity center">
			{#each build.runes.tenacity as rune, i}
				<button onclick={() => (ndx = i)} data-modal-open="select-tenacity">
					<div class="stack">
						<img src="/imgs/runes/RuneBuildFrame.png" alt="" class="frame" />
						{#if rune}
							<img
								src="/imgs/runes/tenacity/{img_name(rune)}"
								alt={rune}
								class="icon"
								hidden={true}
							/>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<div style="text-align: right;">
		Patch: {build.patch}
	</div>

	{#if editable}
		<div class="field">
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label class="label">Tags</label>
			<div class="tags are-medium">
				{#each tags as tag}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<span
						role="button"
						tabindex="0"
						class="tag {(build.tags ?? []).includes(tag) ? 'is-selected' : ''}"
						onclick={() => toggleTag(tag)}
					>
						{tag}
					</span>
				{/each}
			</div>
		</div>
	{/if}
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
								<img src="/imgs/characters/{img_name(character)}" alt={character} title={character} />
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
								<img src="/imgs/weapons/{img_name(weapon)}" alt={weapon} title={weapon} />
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
				<!-- <input placeholder="Search skills..." type="text"> -->
				<div class="columns is-multiline is-centered">
					{#each skills as skill}
						<div class="column is-2">
							<button onclick={() => (build.skills[ndx] = skill)} data-modal-close="select-skill">
								<img src="/imgs/skills/{img_name(skill)}" alt={skill} title={skill} />
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
								<img src="/imgs/runes/versatility/{img_name(rune)}" alt={rune} title={rune} />
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
				<div class="columns is-multiline is-centered">
					{#each runes.tenacity as rune}
						<div class="column is-2">
							<button
								onclick={() => (build.runes.tenacity[ndx] = rune)}
								data-modal-close="select-tenacity"
							>
								<img src="/imgs/runes/tenacity/{img_name(rune)}" alt={rune} title={rune} />
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
	}

	.runes .versatility .icon {
		transform: translateY(-0.8em);
	}

	.runes .tenacity .frame {
		transform: scaleY(-1);
	}
	.runes .tenacity .icon {
		transform: translateY(0.4em);
	}

	label {
		color: white;
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
