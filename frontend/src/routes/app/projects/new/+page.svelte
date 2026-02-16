<script lang="ts">
	import { goto } from '$app/navigation';
	import InputPrompt from '$lib/components/InputPrompt.svelte';
	import heroPlaceholder from '$lib/assets/projects/hero-placeholder.png';
	import { api, type components } from '$lib/api';
    import TurbulentImage from '$lib/components/TurbulentImage.svelte';

	type ProjectType = components['schemas']['CreateProjectDto']['projectType'];

	const projectTypes: { label: string; value: ProjectType }[] = [
		{ label: 'Windows Playable', value: 'windows_playable' },
		{ label: 'Mac Playable', value: 'mac_playable' },
		{ label: 'Linux Playable', value: 'linux_playable' },
		{ label: 'Web Playable', value: 'web_playable' },
		{ label: 'Cross-Platform Playable', value: 'cross_platform_playable' },
	];

	let title = $state('');
	let projectType = $state<ProjectType>('web_playable');
	let description = $state('');
	let demoUrl = $state('');
	let codeUrl = $state('');
	let submitting = $state(false);
	let errorMsg = $state<string | null>(null);

	let fileInput: HTMLInputElement;
	let mediaUrl = $state<string | null>(null);
	let mediaPreview = $state<string | null>(null);
	let uploading = $state(false);

	async function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Show local preview
		mediaPreview = URL.createObjectURL(file);

		uploading = true;
		errorMsg = null;

		const formData = new FormData();
		formData.append('file', file);

		const { data, error } = await api.POST('/api/uploads', {
			body: formData as any,
			bodySerializer: (body: any) => body,
		});

		if (data) {
			mediaUrl = data.url;
		} else {
			errorMsg = 'Failed to upload file. Please try again.';
			mediaPreview = null;
			mediaUrl = null;
		}

		uploading = false;
		input.value = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			goto('/app/projects');
		}
	}

	async function handleSubmit() {
		if (!title.trim() || !description.trim()) {
			errorMsg = 'Title and description are required';
			return;
		}

		submitting = true;
		errorMsg = null;

		const { data, error } = await api.POST('/api/projects/auth', {
			body: {
				projectTitle: title.trim(),
				projectType,
				projectDescription: description.trim(),
				playableUrl: demoUrl.trim() || undefined,
				repoUrl: codeUrl.trim() || undefined,
				screenshotUrl: mediaUrl || undefined,
			},
		});

		if (data) {
			goto(`/app/projects/${data.projectId}`);
		} else {
			errorMsg = 'Failed to create project. Please try again.';
		}

		submitting = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="relative size-full">
	<!-- Hero image -->
	<!-- <div class="absolute left-1/2 top-0 -translate-x-1/2 w-[856px] h-[482px] rounded-3xl overflow-hidden z-0 pointer-events-none">
		<img src={heroPlaceholder} alt="Project hero" class="size-full object-cover" />
	</div> -->
 	<!-- <TurbulentImage
		src={heroPlaceholder}
		alt={'Placeholder'}
		inset="0 -40% 0 40%"
		
		zIndex={0}
	/> -->

	<!-- Project form card -->
	<div class="absolute left-1/2 top-1/2 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]  w-[727px] bg-[#f3e8d8] border-4 border-black rounded-[20px] p-[30px] shadow-[4px_4px_0px_0px_black] flex flex-col gap-2 overflow-clip z-[1]">
		<h1 class="font-cook text-4xl font-semibold text-black m-0 leading-normal">Create New Project</h1>
		<h2 class="font-bricolage text-lg text-black/80 leading-normal">Fill out these fields. Not all of them need to be completed right now.</h2>

		<div class="flex gap-4 w-full">
			<!-- Column 1 -->
			<div class="flex-1 flex flex-col gap-2 min-w-0">
				<div class="flex flex-col gap-1 w-full">
					<label class="font-bricolage text-base font-semibold text-black leading-normal" for="title">Title</label>
					<input
						id="title"
						class="bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] font-bricolage text-base font-semibold text-black w-full outline-none appearance-none placeholder:text-black/50"
						type="text"
						placeholder="Horizons"
						bind:value={title}
					/>
				</div>

				<div class="flex flex-col gap-1 w-full">
					<label class="font-bricolage text-base font-semibold text-black leading-normal" for="project-type">Project Type</label>
					<select id="project-type" class="bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] font-bricolage text-base font-semibold text-black w-full outline-none appearance-none" bind:value={projectType}>
						{#each projectTypes as pt}
							<option value={pt.value}>{pt.label}</option>
						{/each}
					</select>
				</div>

				<div class="flex flex-col gap-1 w-full">
					<label class="font-bricolage text-base font-semibold text-black leading-normal" for="description">Description</label>
					<textarea
						id="description"
						class="bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] font-bricolage text-base font-semibold text-black w-full outline-none resize-none placeholder:text-black/50"
						placeholder="Describe what your project does..."
						rows="4"
						bind:value={description}
					></textarea>
				</div>

				<div class="flex flex-col gap-1 w-full">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="font-bricolage text-base font-semibold text-black leading-normal">Screenshot/Video</label>
					<input
						bind:this={fileInput}
						type="file"
						accept="image/*,video/*"
						class="hidden"
						onchange={handleFileSelect}
					/>
					{#if mediaPreview}
						<button
							class="hover-juice-bg bg-[#f3e8d8] border-2 border-black rounded-lg overflow-hidden shadow-[2px_2px_0px_0px_black] w-full cursor-pointer relative"
							type="button"
							onclick={() => fileInput.click()}
							disabled={uploading}
						>
							<img src={mediaPreview} alt="Upload preview" class="w-full h-32 object-cover" />
							{#if uploading}
								<div class="absolute inset-0 bg-black/40 flex items-center justify-center">
									<span class="font-bricolage text-base font-semibold text-white">Uploading...</span>
								</div>
							{/if}
						</button>
					{:else}
						<button
							class="hover-juice-bg bg-[#f3e8d8] border-2 border-black rounded-lg p-4 shadow-[2px_2px_0px_0px_black] w-full cursor-pointer"
							type="button"
							onclick={() => fileInput.click()}
						>
							<span class="font-bricolage text-base font-semibold text-black/50 text-center block">+ Upload Screenshot/Video</span>
						</button>
					{/if}
					<p class="font-bricolage text-xs font-semibold text-black/60 m-0 leading-normal">
						If your project is difficult to experience, we recommend uploading a video
					</p>
				</div>
			</div>

			<!-- Column 2 -->
			<div class="flex-1 flex flex-col gap-2 min-w-0">
				<div class="flex flex-col gap-1 w-full">
					<label class="font-bricolage text-base font-semibold text-black leading-normal" for="demo-url">Demo URL</label>
					<input
						id="demo-url"
						class="bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] font-bricolage text-base font-semibold text-black w-full outline-none appearance-none placeholder:text-black/50"
						type="url"
						placeholder="https://username.itch.io/mygame"
						bind:value={demoUrl}
					/>
				</div>

				<div class="flex flex-col gap-1 w-full">
					<label class="font-bricolage text-base font-semibold text-black leading-normal" for="code-url">Code URL</label>
					<input
						id="code-url"
						class="bg-[#f3e8d8] border-2 border-black rounded-lg px-4 py-2 shadow-[2px_2px_0px_0px_black] font-bricolage text-base font-semibold text-black w-full outline-none appearance-none placeholder:text-black/50"
						type="url"
						placeholder="https://username.itch.io/mygame"
						bind:value={codeUrl}
					/>
				</div>

				<div class="flex flex-col gap-1 w-full">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="font-bricolage text-base font-semibold text-black leading-normal">Hackatime Projects</label>
					<button class="hover-juice bg-[#fc5b3c] border-2 border-black rounded-lg px-4 py-2 w-full flex items-center justify-between cursor-pointer font-bricolage text-base font-semibold text-black" type="button">
						<span>Link Hackatime Projects</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M4 12L12 4M12 4H5M12 4V11" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Submit -->
		{#if errorMsg}
			<p class="font-bricolage text-sm font-semibold text-red-600 m-0 text-center">{errorMsg}</p>
		{/if}
		<div class="flex items-center justify-center w-full">
			<button class="hover-juice bg-[#ffa936] border-2 border-black rounded-lg px-4 py-2 w-[415px] font-bricolage text-base font-semibold text-black cursor-pointer" type="button" onclick={handleSubmit} disabled={submitting}>
				{submitting ? 'CREATING...' : 'CREATE PROJECT'}
			</button>
		</div>
	</div>

	<!-- Back button -->
	<button class="hover-juice-bg absolute left-8 top-13 z-5 flex items-center gap-2.5 p-5 bg-[#f3e8d8] border-4 border-black rounded-[20px] shadow-[4px_4px_0px_0px_black] cursor-pointer overflow-hidden" onclick={() => goto('/app/projects')}>
		<InputPrompt type="ESC" />
		<span class="font-cook text-2xl font-semibold text-black">BACK</span>
	</button>
</div>

<style>
	.hover-juice {
		transition: transform var(--juice-duration) var(--juice-easing);
	}
	.hover-juice:hover {
		transform: scale(var(--juice-scale));
	}

	.hover-juice-bg {
		transition:
			background-color var(--selected-duration) ease,
			transform var(--juice-duration) var(--juice-easing);
	}
	.hover-juice-bg:hover {
		background-color: #ffa936;
		transform: scale(var(--juice-scale));
	}
</style>
