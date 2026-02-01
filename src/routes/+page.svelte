<script lang="ts">
	import BG from '$lib/components/BG.svelte';
	import BobaText from '$lib/components/BobaText.svelte';
	import Stripes from '$lib/components/Stripes.svelte';
	import Logo from '$lib/assets/Logo.svg';
    import { onMount } from 'svelte';
    import BobaButton from '$lib/components/BobaButton.svelte';
    import TransAm from '$lib/components/TransAm.svelte';
    import Card from '$lib/components/Card.svelte';
    import { fade, fly } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    

    let activated = $state(false);
    let pressed = $state(false);
    let transitioning = $state(false);
    let stripesOutro = $state(false);
    let selectedCard = $state(1);
    let selectedElement = $state(0); // 0 = card itself, 1+ = elements within card
    let emailInput: HTMLInputElement;
    let submitBtn: HTMLButtonElement;
    let isInputFocused = $state(false);

    let logoRect: DOMRect | null = $state(null);
    let stripesRect: DOMRect | null = $state(null);

    function captureLogoRect(node: HTMLElement) {
        logoRect = node.getBoundingClientRect();
        return { duration: 0 };
    }

    function captureStripesRect(node: HTMLElement) {
        stripesRect = node.getBoundingClientRect();
        return { duration: 0 };
    }

    function animateLogoIn(node: HTMLElement) {
        if (!logoRect) return { duration: 0 };
        const to = node.getBoundingClientRect();
        const dx = logoRect.left - to.left;
        const dy = logoRect.top - to.top;
        const sx = logoRect.width / to.width;
        const sy = logoRect.height / to.height;
        return {
            duration: 600,
            easing: quintOut,
            css: (t: number) => {
                const u = 1 - t;
                return `transform: translate(${u * dx}px, ${u * dy}px) scale(${1 + u * (sx - 1)}, ${1 + u * (sy - 1)}); transform-origin: top left;`;
            }
        };
    }

    function animateStripesIn(node: HTMLElement) {
        if (!stripesRect) return { duration: 0 };
        const to = node.getBoundingClientRect();
        const dx = stripesRect.left - to.left;
        const dy = stripesRect.top - to.top;
        const sx = stripesRect.width / to.width;
        const sy = stripesRect.height / to.height;
        return {
            duration: 600,
            easing: quintOut,
            css: (t: number) => {
                const u = 1 - t;
                return `transform: translate(${u * dx}px, ${u * dy}px) scale(${1 + u * (sx - 1)}, ${1 + u * (sy - 1)}); transform-origin: top left;`;
            }
        };
    }

    function showDetail() {
        transitioning = true;
        activated = true;
        pressed = false;

        setTimeout(() => {
            transitioning = false;
        }, 600);
    }

    function focusSelectedElement() {
        if (selectedCard === 1) {
            if (selectedElement === 1) emailInput?.focus();
            else if (selectedElement === 2) submitBtn?.focus();
            else emailInput?.blur();
        }
    }

    onMount(() => {
        window.onkeydown = (ev) => {
            if (!activated) {
                if (ev.key === 'Enter' && !stripesOutro) {
                    pressed = true;
                    stripesOutro = true;
                    setTimeout(showDetail, 400);
                }
            } else {
                const isTyping = document.activeElement === emailInput;
                if (isTyping) return;

                const maxElements = selectedCard === 1 ? 2 : 0; // JOIN NOW has 2 elements (input, button)
                
                if (ev.key === 'a' || ev.key === 'A' || ev.key === 'ArrowLeft') {
                    if (selectedElement === 0) {
                        selectedCard = Math.max(0, selectedCard - 1);
                        selectedElement = 0;
                    }
                } else if (ev.key === 'd' || ev.key === 'D' || ev.key === 'ArrowRight') {
                    if (selectedElement === 0) {
                        selectedCard = Math.min(2, selectedCard + 1);
                        selectedElement = 0;
                    }
                } else if (ev.key === 'w' || ev.key === 'W' || ev.key === 'ArrowUp') {
                    ev.preventDefault();
                    selectedElement = Math.max(0, selectedElement - 1);
                    focusSelectedElement();
                } else if (ev.key === 's' || ev.key === 'S' || ev.key === 'ArrowDown') {
                    ev.preventDefault();
                    selectedElement = Math.min(maxElements, selectedElement + 1);
                    focusSelectedElement();
                }
            }
        };
    });
</script>

<TransAm />

<BG class="flex flex-col overflow-hidden">
    {#if !activated}
        <div class="flex-1 flex flex-col justify-center absolute inset-0">
            <div class="flex flex-col items-center justify-center px-16 pb-4">
                <div out:captureLogoRect>
                    <img src={Logo} alt="Hack Club Horizon" class="w-full max-w-7xl" />
                </div>
            </div>

            <div out:captureStripesRect>
                <Stripes outro={stripesOutro} />
            </div>

            {#if !stripesOutro}
                <div class="flex flex-col items-center justify-center px-16 mt-8" out:fade={{ duration: 300, delay: 100 }}>
                    <BobaButton text="> PRESS ENTER" fallbackWidth={260} {pressed} className="pointer-events-none select-none" />
                </div>
            {/if}
        </div>
    {/if}
    {#if activated}
        <div class="flex flex-col h-full gap-8 pb-8">
            <div class="flex flex-col">
                <div class="flex gap-4 items-end px-10 pt-10 pb-3">
                    <div in:animateLogoIn>
                        <img src={Logo} alt="Hack Club Horizon" class="h-24" />
                    </div>
                    <p in:fade={{ duration: 300, delay: 200 }} class="tagline">HACK CLUB'S <span class="underline">BIGGEST</span> EVENT</p>
                </div>
                <div in:animateStripesIn>
                    <Stripes class="stripe-small" />
                </div>
            </div>

            <div class="flex justify-center items-center gap-8 px-10 h-[435px]">
                    <div in:fly={{ y: 50, duration: 400, delay: 500 }} class="h-full">
                        <Card title="WATCH THE VIDEO" selected={selectedCard === 0} class="w-80 h-full" />
                    </div>
                    <div in:fly={{ y: 50, duration: 400, delay: 600 }} class="h-full">
                        <Card title="JOIN NOW" highlighted selected={selectedCard === 1 && selectedElement === 0} class="w-[437px] h-full gap-4">
                            <div class="w-full flex flex-col gap-5">
                                <div class="input-wrapper">
                                    <input 
                                        bind:this={emailInput} 
                                        type="email" 
                                        placeholder="orpheus@hackclub.com" 
                                        class="input-field" 
                                        class:input-selected={selectedCard === 1 && selectedElement === 1}
                                        onfocus={() => { selectedElement = 1; isInputFocused = true; }}
                                        onblur={() => { isInputFocused = false; }}
                                        onkeydown={(ev) => { if (ev.key === 'Enter') { ev.preventDefault(); selectedElement = 2; submitBtn?.focus(); } }}
                                    />
                                    {#if isInputFocused}
                                        <span class="exit-hint">Press Enter to continue</span>
                                    {/if}
                                </div>
                                <button bind:this={submitBtn} class="submit-btn" class:btn-selected={selectedCard === 1 && selectedElement === 2}>CONTINUE WITH HACK CLUB AUTH</button>
                            </div>
                        </Card>
                    </div>
                    <div in:fly={{ y: 50, duration: 400, delay: 700 }} class="h-full">
                        <Card title="FAQ" selected={selectedCard === 2} class="w-80 h-full" />
                    </div>
                </div>

            <div in:fly={{ y: 20, duration: 300, delay: 800 }} class="flex justify-center">
                <BobaText text="USE WASD OR YOUR MOUSE" />
            </div>
        </div>
    {/if}
</BG>

<style>
    .tagline {
        font-family: 'Cook Widetype', sans-serif;
        font-size: 32px;
        font-weight: 600;
        color: black;
        margin: 0;
    }

    .stripe-small :global(.stripe) {
        height: 18px !important;
    }

    .input-field {
        width: 100%;
        padding: 8px 12px;
        background: #f3e8d8;
        border: 4px solid black;
        border-radius: 8px;
        box-shadow: 4px 4px 0px 0px black;
        font-family: 'Agdasima', sans-serif;
        font-size: 20px;
        transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
		outline: none;
    }

    .submit-btn {
        width: 100%;
        padding: 8px 12px;
        background: #ffa936;
        border: 4px solid black;
        border-radius: 8px;
        box-shadow: 4px 4px 0px 0px black;
        font-family: 'Agdasima', sans-serif;
        font-size: 20px;
        cursor: pointer;
        transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
		outline: none;
    }

    .submit-btn.btn-selected, .submit-btn:hover, .submit-btn:focus, .submit-btn:active {
        outline: 3px solid #ffa936;
        outline-offset: 2px;
        transform: translate(4px, 4px);
        box-shadow: 0px 0px 0px 0px black;
    }

    .input-field:focus, .input-selected {
        border-color: #ffa936 !important;
        transform: translate(4px, 4px);
        box-shadow: 0px 0px 0px 0px black !important;
    }

    .input-wrapper {
        position: relative;
        width: 100%;
    }

    .exit-hint {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        font-family: 'Agdasima', sans-serif;
        font-size: 14px;
        color: #666;
        pointer-events: none;
    }
</style>


