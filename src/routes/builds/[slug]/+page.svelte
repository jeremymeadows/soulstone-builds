<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import { img_name } from '$lib';

	const { data } = $props();
	const { characters, skills, runes, build: orig_build } = data;

	let build = $state(orig_build);
	let editable = $state(false);
	let dirty = $derived(JSON.stringify(orig_build) !== JSON.stringify(build));
	let ndx = 0;

	function reset() {
		build = orig_build;
	}

	function save() {
		console.log(build);
		axios
			.post(page.url.pathname, build)
			.then((res) => {
				console.log(res);
				window.location.href = `/builds/${res.data}`;
			})
			.catch((error) => {
				console.error('Error saving build:', error);
			});
	}

	onMount(() => {
		if (localStorage.getItem('profile')) {
			const profile = JSON.parse(localStorage.getItem('profile')!);
			editable = profile.steamid === build.owner;
		}

		console.log(build.created);
		console.log(typeof build.created);
		console.log(build.created.getTime());

		if (editable) {
			// Add a click event on buttons to open a specific modal
			(document.querySelectorAll('[data-modal-open]') || []).forEach((trigger) => {
				const modal = trigger.getAttribute('data-modal-open')!;
				const target = document.getElementById(modal)!;

				trigger.addEventListener('click', () => {
					target.classList.add('is-active');
				});
			});

			// Add a click event on buttons to open a specific modal
			(document.querySelectorAll('[data-modal-close]') || []).forEach((trigger) => {
				const modal = trigger.getAttribute('data-modal-close')!;
				const target = document.getElementById(modal)!;

				trigger.addEventListener('click', () => {
					target.classList.remove('is-active');
				});
			});

			// Add a keyboard event to close all modals
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
	<h1>{build.name}</h1>

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
</div>

<br />

{#if editable}
	<div class="center">
		<button class="button" onclick={reset} disabled={!dirty}>Reset</button>
		<button class="button" onclick={save} disabled={!dirty}>Save</button>
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
								build.weapon = characters[character].weapons[0];
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
				{#each characters[build.character].weapons as weapon}
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

<style lang="scss">
	.build {
		background-color: var(--bg);
		border: 2px solid var(--primary);
		border-radius: 8px;
		padding: 6px;
	}

	h1 {
		margin-bottom: 0;
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
