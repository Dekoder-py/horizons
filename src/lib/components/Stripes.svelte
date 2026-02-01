<script lang="ts">
	interface Props {
		class?: string;
		outro?: boolean;
	}

	let { class: className = '', outro = false }: Props = $props();
</script>

<div class="stripes flex flex-col gap-[10px] w-full {className}">
	<div class="stripe h-[33px] bg-[#ffa936]" class:outro style="animation-delay: {outro ? '0ms' : '200ms'}"></div>
	<div class="stripe h-[33px] bg-[#f86d95]" class:outro style="animation-delay: {outro ? '50ms' : '300ms'}"></div>
	<div class="stripe h-[33px] bg-[#46467c]" class:outro style="animation-delay: {outro ? '100ms' : '400ms'}"></div>
</div>

<style>
	.stripe {
		width: 0;
		animation: expandWidth 0.5s ease-out forwards;
	}

	.stripe.outro {
		width: 100%;
		margin-left: auto;
		animation: collapseWidth 0.3s ease-in forwards;
	}

	@keyframes expandWidth {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}

	@keyframes collapseWidth {
		from {
			width: 100%;
		}
		to {
			width: 0;
		}
	}
</style>
