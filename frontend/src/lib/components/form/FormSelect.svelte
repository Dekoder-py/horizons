<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		label: string;
		id: string;
		value?: string;
		options: { label: string; value: string }[];
	}

	let {
		label,
		id,
		value = $bindable(''),
		options,
	}: Props = $props();

	let open = $state(false);
	let containerEl = $state<HTMLDivElement | undefined>(undefined);

	let selectedLabel = $derived(options.find((o) => o.value === value)?.label ?? '');

	function handleClickOutside(e: MouseEvent) {
		if (containerEl && !containerEl.contains(e.target as Node)) {
			open = false;
		}
	}

	function select(opt: { label: string; value: string }) {
		value = opt.value;
		open = false;
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="flex flex-col gap-1 w-full" bind:this={containerEl}>
	<label class="font-bricolage text-base font-semibold text-black leading-normal" for={id}>{label}</label>

	<div class="relative w-full">
		<!-- Trigger -->
		<button
			type="button"
			{id}
			class="form-select-trigger bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] w-full flex items-center justify-between gap-2 cursor-pointer outline-none font-bricolage text-base font-semibold text-black"
			onclick={() => (open = !open)}
		>
			<span>{selectedLabel}</span>
			<svg
				class="shrink-0 transition-transform duration-180 {open ? 'rotate-180' : ''}"
				width="12"
				height="8"
				viewBox="0 0 12 8"
				fill="none"
			>
				<path d="M1 1.5L6 6.5L11 1.5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<!-- Dropdown -->
		{#if open}
			<div
				transition:slide={{ duration: 180, easing: cubicOut }}
				class="absolute top-full left-0 right-0 mt-1 bg-[#f3e8d8] border-2 border-black rounded-lg z-20 shadow-[2px_2px_0px_0px_black] overflow-y-auto dropdown-list"
			>
				{#each options as opt (opt.value)}
					<button
						type="button"
						class="dropdown-item w-full flex items-center justify-between px-4 py-2 cursor-pointer outline-none text-left font-bricolage text-sm font-normal text-black leading-normal {opt.value === value ? 'selected bg-[#ffa936]' : ''}"
						onclick={() => select(opt)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.form-select-trigger {
		transition: transform var(--juice-duration) var(--juice-easing);
	}
	.form-select-trigger:hover {
		transform: scale(var(--juice-scale));
	}
	.dropdown-item {
		transition: background-color var(--selected-duration) ease;
	}
	.dropdown-item:not(.selected):hover {
		background-color: rgba(0, 0, 0, 0.07);
	}
	.dropdown-list::-webkit-scrollbar {
		width: 8px;
	}
	.dropdown-list::-webkit-scrollbar-track {
		background: transparent;
	}
	.dropdown-list::-webkit-scrollbar-thumb {
		background: black;
		border-radius: 8px;
	}
</style>
